"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Award, HandMetal, Factory, MapPin, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800 px-6 py-16">
      <div className="max-w-5xl mx-auto space-y-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            About AH Handicraft
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            A trusted name in handcrafted trophies, metal art, and premium custom-made creations,
            built with passion and precision in the heart of Moradabad.
          </p>
        </motion.div>

        <section className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <h2 className="text-3xl font-bold">Crafted with Skill, Delivered with Trust</h2>
            <p className="text-gray-700 leading-relaxed">
              AH Handicraft specializes in creating beautifully designed trophies, awards,
              and handcrafted metal items. Each piece is made by experienced artisans who pour
              years of skill and dedication into every detail.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether it's sports trophies, corporate awards, event souvenirs, or personalized gifts,
              we bring your ideas to life with quality craftsmanship.
            </p>

            <div className="flex items-center gap-3 text-blue-600 font-medium">
              <Sparkles className="w-6 h-6" />
              Premium quality handcrafted products
            </div>
            <div className="flex items-center gap-3 text-blue-600 font-medium">
              <Award className="w-6 h-6" />
              Custom trophy designs for every occasion
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src="https://res.cloudinary.com/ddnxjo72z/image/upload/v1762186666/Gemini_Generated_Image_jwrmrsjwrmrsjwrm_le67jl.png"
              alt="Handicraft Workshop"
              fill
              className="object-cover"
            />
          </motion.div>
        </section>

        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Why Choose Us
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow border border-gray-200"
            >
              <Award className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Every trophy and handicraft item is made using durable materials and top-grade finishing.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow border border-gray-200"
            >
              <HandMetal className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Handcrafted Excellence</h3>
              <p className="text-gray-600">
                Experienced artisans from Moradabad craft each piece with fine detail and perfection.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow border border-gray-200"
            >
              <Factory className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Manufactured Locally</h3>
              <p className="text-gray-600">
                All products are designed and produced in Moradabad, known globally for its brass handicraft heritage.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Our Location
          </motion.h2>

          <div className="flex items-center gap-3 text-gray-700 text-lg">
            <MapPin className="w-6 h-6 text-blue-600" />
            Based in Moradabad, Uttar Pradesh — India’s leading city for metal handicrafts.
          </div>

          <p className="mt-4 text-gray-600">
            Our workshop and store continue the legacy of fine craftwork passed down through generations.
            We proudly serve customers across India with reliable delivery and custom order support.
          </p>
        </section>
      </div>
    </div>
  );
}
