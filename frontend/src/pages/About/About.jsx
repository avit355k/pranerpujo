import React from "react";
import { motion } from "framer-motion";

const About = () => {
  const partners = [
    {
      name: "MassArt",
      logo: "https://massart.in/wp-content/uploads/elementor/thumbs/logo-qr9acsclmd2q8595b59ahdtqo7khqr635qvufs4m36.png",
    },
    {
      name: "UNESCO",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Logo_UNESCO_2021.svg/1200px-Logo_UNESCO_2021.svg.png",
    },
    {
      name: "Asian Paints",
      logo: "https://static.asianpaints.com/etc.clientlibs/apcolourcatalogue/clientlibs/clientlib-global-unification/resources/images/header/asian-paints-logo.webp",
    },
    {
      name: "British Council",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/British_Council_logo.svg/300px-British_Council_logo.svg.png?20150524171749",
    },
  ];

  const stats = [
    { value: "25+ million", label: "visitors" },
    { value: "2300+ site", label: "specific Art installations" },
    { value: "80,000 cr+", label: "industry" },
    { value: "2 lacs+", label: "artisans engaged for livelihood" },
  ];

  const testimonials = [
    {
      text: "Durga Puja is basically a very religious festival. There is an addition to the religious element of the festival which now comes with modern Art. I find this Art very interesting because it shows how alive and vibrant this festival is. Maybe this is the biggest folk Art, street Art festival in the world and it goes beyond the worshiping aspects. MassArt, I must say, is to be praised and commended for this addition to the traditional Durga Puja.",
      name: "Dr. Philipp Ackermann",
      title: "Ambassador of Germany to India",
      img: "https://massart.in/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-03-at-11.46.10_04e51236.jpg",
    },
    {
      text: "What I believe would be wonderful is to take these pavilions to other places of the world, because the world is going to be totally in love with these pandals. They are fascinating. I understand that they are not made in this way anywhere else in India. So this is a mystery that you have to come to Kolkata to see.",
      name: "Andre Aranha Correa do Lago",
      title: "Ambassador of Brazil",
      img: "https://massart.in/wp-content/uploads/2024/12/Untitled-3.jpg",
    },
    {
      text: "Perhaps in another life, Shakespeare in Stratford would be writing about Calcutta and the City of Joy — and Durga Puja and its joy.",
      name: "Jonathan Kennedy",
      title: "Director, Arts India British Council",
      img: "https://massart.in/wp-content/uploads/2024/12/g.jpg",
    },
  ];

  return (
    <div className="bg-white dark:bg-black transition-colors duration-300">
      {/* Header */}
      <section className="relative py-20 px-8 md:px-16 lg:px-24 text-center bg-gradient-to-r from-red-600 to-red-500 text-white">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Praner Pujo
        </motion.h1>
        <motion.p
          className="max-w-2xl mx-auto text-lg text-neutral-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Discover the heart of Kolkata’s Durga Puja through immersive digital
          experiences — from interactive pandal tours to award-winning artistry.
        </motion.p>
      </section>

      {/* Story */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-16 gap-10">
        <motion.img
          src="https://kenduashantisangha.org/assets/images/artist-details/2021/img-2.jpg"
          alt="Durga Puja Art"
          className="w-full md:w-1/2 rounded-xl shadow-lg object-cover max-h-[400px]"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />
        <motion.div
          className="md:w-1/2 space-y-4 text-neutral-700 dark:text-neutral-300"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-red-600">Our Story</h2>
          <p>
            Praner Pujo began as a passion project to bring the magic of Kolkata’s Durga Puja to people everywhere. We wanted to create a way for devotees, art lovers, and cultural enthusiasts to experience the grandeur of
            pandals from their homes.What started as a simple idea evolved into a full-fledged immersive platform
            showcasing the best of art, devotion, and culture. Our team works tirelessly to curate experiences that
            celebrate both tradition and technology.
          </p>
        </motion.div>
      </section>

      {/* Statistical Attributes */}
      <section className="py-16 bg-neutral-100 dark:bg-neutral-900 px-8 md:px-16 lg:px-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-10">
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

      {/* Testimonials Section (replacing Team) */}
      <section className="py-16 px-8 md:px-16 lg:px-24 bg-white dark:bg-black text-center">
        <motion.h2
          className="text-3xl font-bold text-red-600 mb-10 capitalize"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Testimonials
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-xl shadow-md hover:shadow-lg transition text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                {t.text}
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-black dark:text-white">
                    - {t.name.toLowerCase()}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 px-8 md:px-16 lg:px-24 text-center">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center justify-center">
          {partners.map((partner, idx) => (
            <motion.div
              key={idx}
              className="p-4 rounded-lg flex justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-20 object-contain"
              />
            </motion.div>
          ))}
        </div>
      </section>
      {/* Credits Section */}
<section className="py-16 px-8 md:px-16 lg:px-24 bg-neutral-100 dark:bg-neutral-900 text-center">
  <motion.h2
    className="text-3xl font-bold text-red-600 mb-10"
    initial={{ opacity: 0, y: -30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    Credits
  </motion.h2>
  <p className="max-w-2xl mx-auto text-neutral-700 dark:text-neutral-300 mb-12">
    This project is the result of collaboration, creativity, and cultural passion — a tribute to the artistry and devotion of Durga Puja.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
    {/* Developer & Designer */}
    <motion.div
      className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      viewport={{ once: true }}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        alt="Developer"
        className="w-20 h-20 mb-4 rounded-full object-cover"
      />
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">
        Avijit Rakshit
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Developer & UI/UX Designer
      </p>
    </motion.div>

    {/* Idea & Research */}
    <motion.div
      className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/4140/4140051.png"
        alt="Researcher"
        className="w-20 h-20 mb-4 rounded-full object-cover"
      />
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">
        Manabrata Ghosh
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Idea & Research Contributor
      </p>
    </motion.div>
  </div>
</section>

    </div>
  );
};

export default About;
