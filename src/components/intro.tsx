'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Intro() {
  return (
    <section className="mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem] pt-28 sm:pt-36">
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <Image
              src="/profile-photo.png"
              alt="Timothy's portrait"
              width="384"
              height="384"
              quality="95"
              priority={true}
              className="h-48 w-48 rounded-full border-[0.35rem] border-white object-cover shadow-xl"
            />
          </motion.div>
        </div>
      </div>

      <motion.h1
        className="mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-4xl"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="font-bold">Hi there 👋, Timothy here.</span> I am
        currently a <span className="font-bold">Computer Science Student</span>{' '}
        at <span className="font-bold">National University of Singapore</span>.{' '}
        <br />
        <br />I enjoy building applications to solve{' '}
        <span className="italic">real-life problems</span>. My current focus is{' '}
        <span className="underline">Mobile Development 📱</span>.
      </motion.h1>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-lg font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <a
          className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
          href="/contact"
        >
          Contact me here <Mail className="opacity-70" size={20} />
        </a>

        <a
          className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition border border-black/10 dark:bg-white/10"
          href="https://linkedin.com/in/timpipi"
          target="_blank"
        >
          <Linkedin size={20} /> LinkedIn
        </a>

        <a
          className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition border border-black/10 dark:bg-white/10"
          href="https://github.com/tim-pipi"
          target="_blank"
        >
          <Github size={20} /> GitHub
        </a>
      </motion.div>
    </section>
  );
}
