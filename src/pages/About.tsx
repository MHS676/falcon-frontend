import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen pt-32">
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-heading font-bold mb-4">About Me</h1>
            <p className="text-xl text-gray-600">
              Get to know more about my journey and expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-heading font-bold mb-6">My Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Hello! I'm Hasan Talukder, a passionate full-stack developer with a
                  love for creating elegant solutions to complex problems.
                </p>
                <p>
                  I specialize in building modern web applications using React, NestJS,
                  and PostgreSQL. My goal is to create user-friendly, performant, and
                  scalable applications that make a real difference.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new technologies,
                  contributing to open-source projects, or sharing knowledge with the
                  developer community.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-heading font-bold mb-6">What I Do</h2>
              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-2">Frontend Development</h3>
                  <p className="text-gray-600">
                    Building responsive and interactive user interfaces with React,
                    TypeScript, and Tailwind CSS.
                  </p>
                </div>
                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-2">Backend Development</h3>
                  <p className="text-gray-600">
                    Creating robust RESTful APIs with NestJS, Prisma, and PostgreSQL.
                  </p>
                </div>
                <div className="card p-6">
                  <h3 className="text-xl font-semibold mb-2">Database Design</h3>
                  <p className="text-gray-600">
                    Designing efficient database schemas and optimizing query performance.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
