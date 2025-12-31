"use client"

import Image from "next/image"
import { useState } from "react"

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)

  const galleryImages = [
    {
      id: 1,
      src: "/clg_images/clg_entrance.webp",
      alt: "College campus entrance",
      title: "Campus Entrance",
    },
    {
      id: 2,
      src: "/clg_images/library.webp",
      alt: "Library and study area",
      title: "Study Areas",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
      alt: "Computer lab",
      title: "Tech Lab",
    },
    {
      id: 4,
      src: "/clg_images/auditorium.webp",
      alt: "Auditorium and events",
      title: "Gnc Auditorium",
    },
    {
      id: 5,
      src: "/clg_images/sports.webp",
      alt: "Sports facilities",
      title: "Sports Ground",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
      alt: "Classroom learning",
      title: "Event Area",
    },
  ]

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-deep-night">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-rajdhani text-balance">
            Campus Gallery
          </h2>
          <p className="text-cyan-400 text-lg font-poppins max-w-2xl">
            Explore the vibrant campus life at Guru Nanak College
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg cursor-pointer h-64 md:h-72"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-night via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-poppins font-semibold">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-cyan-400 hover:text-cyan-300 text-2xl font-bold"
              >
                ✕
              </button>
              <Image
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                width={800}
                height={600}
                className="w-full rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
              />
              <p className="text-center text-cyan-400 mt-4 font-poppins">{selectedImage.title}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
