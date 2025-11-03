import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import { OrderModel } from "@/model/Order.model";
import { TrophyModel } from "@/model/Trophy.model";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Please log in first!" },
                { status: 401 }
            );
        }

        const user = await UserModel.findOne({ email: session.user?.email }).populate("cart.trophyId");
        if (!user) {
            throw new Error("User not found!");
        }

        if (!user.cart || user.cart.length === 0) {
            throw new Error("Your cart is empty!");
        }

        const { addressIndex } = await request.json();
        if (addressIndex === undefined || !user.addresses[addressIndex]) {
            throw new Error("Invalid address selected!");
        }

        const selectedAddress = user.addresses[addressIndex];

        let totalAmount = 0;
        const orderItems = user.cart.map((item: any) => {
            totalAmount += item.trophyId.price * item.quantity;
            return {
                trophyId: item.trophyId._id,
                quantity: item.quantity,
                price: item.trophyId.price
            };
        });

        const newOrder = new OrderModel({
            userId: user._id,
            items: orderItems,
            address: selectedAddress,
            totalAmount,
            status: "Pending"
        });

        await newOrder.save();

        user.cart = [];
        await user.save();

        return NextResponse.json(
            { success: true, message: "Order placed successfully!", data: newOrder },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Error placing order!" },
            { status: 500 }
        );
    }
}
