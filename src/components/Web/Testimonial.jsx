"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import { FaStar } from "react-icons/fa";


const reviews = [
  {
    image: "/2t.jpg",
    name: "Ashish Dager",
    location: "Ghaziabad",
    testimonial:
      "I found ATD Money suitable as per my needs and requirements. They guys takes least time to approve a loan and offer sensible interest rates. And the best thing about ATD Money is lower paper work as an applicant is required to fill just a simple online loan application form."
  },
  {
    image: "/3t.jpg",
    name: "Surender Singh",
    location: "Noida",
    testimonial:
      "Until I was not familiar with such services that ATD Money is offering, I was not believing in the fact that getting a loan could be so quick and easy. Many thanks to ATD Money for offering such a responsive and useful facility."
  },
  {
    image: "/kenua.jpeg",
    name: "Kaiomarz Jimmy",
    location: "Kekuna",
    testimonial:
      "Overall ATD MONEY IS A VERY GOOD APP FOR SALARIED BORROWERS . All the staff are very very coooerative. And by the end of the day the loan amount gets credited also quickly.. One of the best apo in finance."
  },
  {
    image: "/4t.jpg",
    name: "Mohit Yadav",
    location: "Greater Noida",
    testimonial:
      "Applying for a small loan at ATD Money is a hassle free procedure that I have never seen such an instant loan approval before. The interest rate, responsiveness, and support are also up to the mark. Kudos to team ATD."
  }
];

const Testimonial = () => {
  return (
    <div className="w-full px-4 md:px-20 py-0 bg-[#edebff] md:py-8 relative">
        <div className=" py-8 md:py-10">
      <h2 className="text-2xl md:text-3xl mb-4 font-semibold text-center">
        What Our Customers Are Saying
      </h2>
      <p className="text-gray-700 text-base md:text-lg text-center mt-2">
        Real stories from real people who loved their experience with us
      </p>
      </div>
      {/* Custom navigation buttons */}
      <div className="absolute top-1/2 left-1 md:left-5 z-10 translate-y-10">
        <button className="swiper-button-prev !w-10 !h-10 !static flex items-center justify-center bg-white shadow-md rounded-full hover:bg-indigo-100 transition duration-300 after:hidden">
          <ChevronLeft className="w-5 h-5 text-indigo-600" />
        </button>
      </div>

      <div className="absolute top-1/2 right-1 md:right-5 z-10 translate-y-10">
        <button className="swiper-button-next !w-10 !h-10 !static flex items-center justify-center bg-white shadow-md rounded-full hover:bg-indigo-100 transition duration-300 after:hidden">
          <ChevronRight className="w-5 h-5 text-indigo-600" />
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
        className="!pb-12"
      >
        {reviews.map((review, index) =>
          <SwiperSlide key={index}>
            <ReviewCard {...review} index={index} />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

function ReviewCard({ image, name, location, testimonial, index }) {
  const gradients = [
    "from-purple-200 to-indigo-100",
    "from-indigo-200 to-blue-100",
    "from-blue-200 to-purple-100",
    "from-violet-200 to-indigo-100"
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <div
      className={`border border-indigo-100 p-4 rounded-lg shadow-md bg-gradient-to-br ${gradient} hover:shadow-lg transition-shadow duration-300 min-h-68`}>
      <div className="flex flex-col sm:flex-row gap-4 h-full">
        {/* Left side - Profile section */}
        <div className="flex flex-col items-center sm:items-start gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-sm transform -translate-x-1 translate-y-1" />
            <img
              src={image}
              alt={name}
              className="w-20 h-20 shadow-md  object-cover rounded-full relative z-10 border border-white"
            />
          </div>
          <div>
            <h3 className="font-medium text-indigo-900">
              {name}
            </h3>
            <p className="text-sm text-indigo-700">
              {location}
            </p>
          </div>
        </div>

        {/* Right side - Testimonial content */}
        <div className="flex-1 relative">
          {/* Quote icon */}
          <BiSolidQuoteAltLeft className="opacity-20 " />
          
<div>
<div className="flex pl-6 items-center">
            {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-5 h-5  text-yellow-400 fill-current" />

            ))}
          </div>
          <p className="text-gray-600 md:text-sm 2xl:text-base  italic pl-6 pt-2">
            {testimonial}
          </p>
          </div>

          {/* Abstract art element */}
          <div className="absolute bottom-0 right-0 opacity-10">
            <div
              className="w-12 h-12 bg-indigo-400"
              style={{
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
