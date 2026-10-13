'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Github, Link, Code2 } from 'lucide-react';
import { projectsData } from '@/data/portfolio';

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-28 mb-28">
      <motion.h2 
        className="text-3xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Projects
      </motion.h2>
      <div className="flex flex-col gap-8">
        {projectsData.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="group relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-[450px] h-[250px] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    className="object-contain w-full h-full rounded-lg"
                    fill
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Code2 className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                {project.badge && (
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    {project.badge}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <ul className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <li
                      key={index}
                      className="bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full dark:text-white/70"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="flex items-center gap-2 hover:text-gray-950 dark:hover:text-gray-200"
                    >
                      <Github size={20} />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      className="flex items-center gap-2 hover:text-gray-950 dark:hover:text-gray-200"
                    >
                      <Link size={20} />
                      {project.liveLabel ?? 'Live Demo'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
