"use client"

import Image from "next/image"
import { useState } from "react"

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)

  const galleryImages = [
    {
      id: 1,
      src: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwSc6a1DV0k_EyALs2I18-0igxaY7xECJG5zSJLFf43BthoR1QuzRkzsM9jNAXf-uIK5z_hwKMJZNVocbFVdo5B-uLOqoEFiAGASQpiZ7B9aokkXF_lIyMqDOpjWSnn6kPk9PKx=s1360-w1360-h1020-rw",
      alt: "College campus entrance",
      title: "Campus Entrance",
    },
    {
      id: 2,
      src: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSz_zXHFUo9vas1Mo6TvT1F0BVqXIvm8zTdj2kdFktO102jz1mUtdd90qyAPW0XcVFsKvmw023V7ohULtkUcTAAoqI1PC-XOTrBeymgqKouX5fNjTDRDrpVmPdA4LOtSG05iicxF=s1360-w1360-h1020-rw",
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
      src: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxzcC1_ZLk_6VM3GF4o9A3PcnUBMlYVbAl8Z9diB2T7ql7Dg2KMGw2fFwH_qUBZ_SWZEXW2n0y71rQ_mOTwtf4dQTfpRQnTPsv5Pvsd-cHM2ncl66Ko-Og1m-k3q0do16_7wDQ4=s1360-w1360-h1020-rw",
      alt: "Auditorium and events",
      title: "Gnc Auditorium",
    },
    {
      id: 5,
      src: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwSgmYfE_mSSn2wz1KXYjwWZjJ24v5KF3qOTEKNJqHrNuI2nyFIuovbzV5eulUx70idjX2njM9lfxJMh_lsbujvvpRuNlhi1EE1KAgvnNafohS3wFfs69PsXm4hsLGUKle2LsUL=s1360-w1360-h1020-rw",
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
