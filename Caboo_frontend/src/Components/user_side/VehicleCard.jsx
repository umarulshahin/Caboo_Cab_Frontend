import React, { useState } from 'react';
import auto from "../../assets/auto.jpg";
import car from "../../assets/car.webp";
import bike from "../../assets/bike.webp";
import { useSelector } from 'react-redux';

const VehicleCard = ({ handleRide }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const charges = useSelector((state) => state.ride_data.charges);

  const cards = [
    { id: 1, type: "Auto", imgSrc: auto, price: charges.auto },
    { id: 2, type: "Car", imgSrc: car, price: charges.car },
    { id: 3, type: "Bike", imgSrc: bike, price: charges.bike },
  ];
  
  const handleCardClick = (card) => {
    console.log(card)
    setSelectedCard(card.id);
    handleRide(card); 

  }; 
   return (
    <div className="flex justify-center space-x-4">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => {
           handleCardClick(card);
          }}
          className={`relative rounded-2xl border h-40 w-40 border-blue-500 hover:border-green-400 shadow-lg p-4 cursor-pointer ${
            selectedCard === card.id ? 'border-green-500' : ''
          }`}
        >
          <div className="text-center font-bold mb-2">
            {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
          </div>
          <img className="h-20 w-full object-cover" src={card.imgSrc} alt={`Card ${card.id}`} />
          <div className="font-bold text-sm flex items-center justify-center ">
            <span className="material-icons text-sm font-bold">currency_rupee</span>
            {card.price}/-
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleCard;
