import React from "react";
import { motion } from "motion/react";

const About = () => {
 
  const stats = [
    { value: "25+ million", label: "visitors" },
    { value: "2300+ site", label: "specific Art installations" },
    { value: "80,000 cr+", label: "industry" },
    { value: "2 lacs+", label: "artisans engaged for livelihood" },
  ];

  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <section className="relative py-20 px-8 md:px-16 lg:px-24 text-center bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
        <motion.h1
          className="text-4xl md:text-5xl font-display font-bold mb-4 text-neutral-800 dark:text-white italic"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Bringing Kolkata’s Durga Puja Magic to Your Home: <span className="text-red-600">The Story of Praner Pujo</span>
        </motion.h1>

      </section>
      {/* Story */}
      <section className="px-8 md:px-16 lg:px-24 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-neutral-700 dark:text-neutral-300"
        >
          {/* Floated image — text wraps around it */}
          <div className="float-left w-full sm:w-1/2 md:w-2/5 mr-8 mb-4">
            <div className="w-full  sm:h-[280px] md:h-[310px] overflow-hidden rounded-xl shadow-lg">
              <img
                src="/about.webp"
                alt="Durga Puja Art"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400 font-synonym font-medium">
              Bringing Kolkata’s Durga Puja Magic to Your Home: The Story of Praner Pujo
              There’s something truly special about Durga Puja in Kolkata—the vibrant colors,
              the intricate artistry of the pandals, and the deep sense of devotion that fills
              the air. For many, it’s not just a festival, but a heartfelt celebration of culture
              and community. This year, if you can’t be there in person, don’t worry—Praner Pujo
              is here to bring that magic right to your doorstep, no matter where you are in the world.
            </p>

            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400 font-synonym font-medium">
              What started as a simple passion project has blossomed into a full-fledged immersive experience.
              The founders of Praner Pujo wanted to share the grandeur of Kolkata’s iconic Durga Puja pandals
              beyond geographical boundaries. Their vision was to create a platform where devotees, art lovers,
              and culture enthusiasts could come together to celebrate tradition, even from afar.
            </p>

            {/* This paragraph runs the full width, once the floated image has ended above it */}
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400 clear-left font-synonym font-medium">
              Behind the scenes, a dedicated team works tirelessly to curate experiences that blend the richness of age-old
              customs with the possibilities of modern technology. The result is an accessible, immersive celebration that
              showcases the best of art, devotion, and cultural heritage. Whether you’re admiring the stunning artistry of
              the pandals, soaking in devotional rituals, or simply enjoying the festive spirit, Praner Pujo offers a
              unique way to connect with the festival’s heart and soul.
            </p>

            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400 font-synonym font-medium">
              It’s this seamless fusion of tradition and innovation that makes Praner Pujo stand out—not
              just a digital event, but a heartfelt celebration that honors the essence of Durga Puja.
              So, whether you're near or far, this platform invites you to experience the joy,
              creativity, and devotion that define one of India’s most beloved festivals.
              Stay tuned for more updates and immersive experiences from Praner Pujo as they continue to
              bring the spirit of Kolkata’s Durga Puja alive in new and exciting ways. Until then,
              let’s celebrate the festival with the same passion and warmth that has inspired this
              wonderful initiative!
            </p>
          </div>
        </motion.div>
      </section>


      {/* Statistical Attributes */}
      <section className="py-16 bg-neutral-100 dark:bg-neutral-900 px-8 md:px-16 lg:px-24 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-black dark:text-white mb-10">
          Statistical Attributes of <br />
          <span className="text-red-600">Durga Puja Art Kolkata</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="bg-gray-200 dark:bg-neutral-800 p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-black dark:text-white">
                {stat.value}
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
