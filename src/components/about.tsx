'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.section
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <h2 className="text-3xl font-bold mb-8">About Me</h2>
      <p className="mb-3">
        I am currently a Year 3{' '}
        <span className="font-medium">Computer Science</span> student at{' '}
        <span className="font-medium">National University of Singapore</span>.{' '}
        <br />
        My core interests lie in{' '}
        <span className="font-medium">Mobile Development</span> and{' '}
        <span className="font-medium">Software Engineering</span>.
      </p>
      <p className="mb-3">
        My programming journey started when I built my first Android app in
        secondary school. Since then, I have worked on various projects, from{' '}
        <span className="font-medium">mobile applications</span> to{' '}
        <span className="font-medium">full-stack web development</span>.
      </p>
      <p>
        When I am not coding, you will find me{' '}
        <span className="font-medium">playing badminton</span>,{' '}
        <span className="font-medium">travelling the world</span>, or{' '}
        <span className="font-medium">exploring new technologies</span>. I am
        always excited to learn new things and take on challenging projects.
      </p>
    </motion.section>
  );
}
