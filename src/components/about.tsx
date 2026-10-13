'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.section
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      id="about"
    >
      <h2 className="text-3xl font-bold mb-8">About Me</h2>
      <p className="mb-3">
        I am a <span className="font-medium">Software Engineer</span> at{' '}
        <span className="font-medium">Rakuten Asia</span> in Singapore, and a{' '}
        <span className="font-medium">Computer Science</span> graduate of the{' '}
        <span className="font-medium">National University of Singapore</span>{' '}
        (<span className="font-medium">Highest Distinction</span>, ASEAN
        Undergraduate Scholar). <br />
        I work on{' '}
        <span className="font-medium">backend and real-time data infrastructure</span>{' '}
        with Kafka, Apache Pinot, Spring Boot and Kubernetes.
      </p>
      <p className="mb-3">
        I am passionate about building solutions for real world problems. I love
        getting my hands dirty through{' '}
        <span className="font-medium">hands-on experience</span>, prototyping
        solutions and improving them through feedback.
      </p>
      <p className="mb-3">
        My programming journey started when I built my first Android app in
        secondary school. Since then, I have worked on various projects, from{' '}
        <span className="font-medium">mobile applications</span> to{' '}
        <span className="font-medium">full-stack web development</span>, and
        spent two years as a{' '}
        <span className="font-medium">Teaching Assistant</span> at NUS across
        six semesters of programming and software engineering modules.
      </p>
      <p>
        When I am not coding, you will find me{' '}
        <span className="font-medium">playing badminton</span>,{' '}
        <span className="font-medium">playing guitar</span>,{' '}
        <span className="font-medium">travelling the world</span>, or{' '}
        <span className="font-medium">exploring new technologies</span>. I am
        always excited to learn new things and take on challenging projects.
      </p>
    </motion.section>
  );
}
