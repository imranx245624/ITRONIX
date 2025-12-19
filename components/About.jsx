"use client"

import { MapPin, Phone, Mail, Globe } from "lucide-react"

export default function About() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-deep-night ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* College Information */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-rajdhani text-balance">
              About Guru Nanak College
            </h2>
            <p className="text-gray-300 font-poppins text-lg leading-relaxed mb-6">
              Guru Nanak College of Arts, Science and Commerce is a premier educational institution dedicated to
              academic excellence and holistic student development. With state-of-the-art facilities and experienced
              faculty, we provide a transformative learning experience.
            </p>
            <p className="text-gray-400 font-poppins leading-relaxed mb-8">
              Our commitment to innovation, cultural diversity, and student success has made us a trusted choice for
              thousands of students pursuing higher education.
            </p>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="text-cyan-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-foreground font-poppins">Address</h3>
                  <p className="text-gray-400">Guru Nanak College  of Arts,Science & Commerce <br/>GTB Nagar, Sion, Mumbai</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-magenta-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-foreground font-poppins">Phone</h3>
                  <p className="text-gray-400">+91-40-2766-4531</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-orange-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-foreground font-poppins">Email</h3>
                  <p className="text-gray-400">info@gurunanakcollegeasc.in</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Globe className="text-cyan-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-foreground font-poppins">Website</h3>
                  <a
                    href="https://www.gurunanakcollegeasc.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    www.gurunanakcollegeasc.in
                  </a>
                </div>
              </div>
            </div>
          </div>
          

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-900/5 border border-cyan-400/20 rounded-lg p-6">
              <div className="text-4xl font-bold text-cyan-400 font-rajdhani mb-2">30+</div>
              <p className="text-gray-400 font-poppins">Years of Excellence</p>
            </div>

            <div className="bg-gradient-to-br from-magenta-900/20 to-magenta-900/5 border border-magenta-400/20 rounded-lg p-6">
              <div className="text-4xl font-bold text-magenta-400 font-rajdhani mb-2">10k+</div>
              <p className="text-gray-400 font-poppins">Students Empowered</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/20 to-orange-900/5 border border-orange-400/20 rounded-lg p-6">
              <div className="text-4xl font-bold text-orange-400 font-rajdhani mb-2">100+</div>
              <p className="text-gray-400 font-poppins">Achievements & Awards</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-900/5 border border-cyan-400/20 rounded-lg p-6">
              <div className="text-4xl font-bold text-cyan-400 font-rajdhani mb-2">15+</div>
              <p className="text-gray-400 font-poppins">Programs Offered</p>
            </div>
          </div>
          {/* IT section information */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-rajdhani text-balance text-neon-cyan">
              About Information Technology Department  
            </h2>
            <p className="text-gray-300 font-poppins text-lg leading-relaxed mb-6">
              The department offers undergraduate and postgraduate programs 
              in Information Technology. These programs focus on core IT concepts, programming languages,
               software development, database management, networking, cybersecurity, artificial intelligence, and other emerging technologies.
            </p>
            
          </div>
        </div>
      </div>
    </section>
  )
}
