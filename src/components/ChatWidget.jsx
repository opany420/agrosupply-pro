import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle } from "lucide-react";

const botResponses = {
  default: "Thank you for your message! Our team will get back to you shortly. You can also reach us on WhatsApp at +254 712 345 678.",
  hello: "Hello! Welcome to Chicago Agro Supplies. How can I help you today? I can assist with product information, orders, delivery questions, and more.",
  hi: "Hi there! Welcome to Chicago Agro Supplies. How can I assist you today?",
  product: "We offer a wide range of agricultural products including seeds, fertilizers, pesticides, irrigation equipment, tools, and animal feed. Visit our Products page to browse our full catalogue!",
  seeds: "We have premium hybrid maize seeds, sunflower seeds, and more. Our seeds have a 98% germination rate and are drought resistant. Check the Products page for full details and pricing in KES!",
  fertilizer: "We stock NPK fertilizers, Urea, and organic options. All priced in KES with free delivery on orders above KES 25,000!",
  price: "All our prices are in Kenyan Shillings (KES). We offer competitive prices and bulk discounts. Orders above KES 25,000 get free delivery!",
  delivery: "We offer free delivery on orders above KES 25,000. Delivery within Nairobi takes 1-2 business days, and upcountry takes 2-4 business days.",
  order: "You can place an order directly on our website by adding products to your cart and proceeding to checkout. We accept M-Pesa, bank transfer, and cash on delivery!",
  payment: "We accept M-Pesa, bank transfer (Equity Bank), and cash on delivery for local orders. All transactions are secure!",
  mpesa: "To pay via M-Pesa, select M-Pesa at checkout and enter your phone number. You will receive a prompt to complete the payment.",
  contact: "You can reach us at: Phone: +254 712 345 678, Email: info@chicagoagro.com, or chat with us on WhatsApp!",
  return: "We have a 30-day return policy for unopened products. For defective items, we offer full replacement. Contact us to initiate a return.",
  discount: "Yes! We offer bulk discounts. Orders above KES 65,000 get 10% off, above KES 129,000 get 15% off, and above KES 645,000 get 20% off!",
  hours: "We are open Monday to Saturday, 8am to 6pm. You can always place orders online 24/7!",
};

function getBotReply(message) {
  const msg = message.toLowerCase();
  for (const key of Object.keys(botResponses)) {
    if (msg.includes(key)) return botResponses[key];
  }
  return botResponses.default;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! Welcome to Chicago Agro Supplies. I'm your virtual assistant. How can I help you today? I can assist with product information, orders, delivery questions, and more." }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(input);
      setMessages(prev => [...prev, { from: "bot", text: reply }]);
      setTyping(false);
    }, 1000);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100"
          style={{ height: "420px" }}>

          {/* Header */}
          <div className="bg-emerald-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Support Assistant</p>
                <p className="text-white/80 text-xs">Chicago Agro Supplies</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={"flex " + (msg.from === "user" ? "justify-end" : "justify-start")}>
                {msg.from === "bot" && (
                  <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                )}
                <div className={"max-w-xs px-3 py-2 rounded-2xl text-sm leading-relaxed " + (
                  msg.from === "user"
                    ? "bg-emerald-600 text-white rounded-tr-sm"
                    : "bg-white text-gray-700 shadow-sm rounded-tl-sm"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
            {["Delivery", "Payment", "Products", "Discount"].map(q => (
              <button key={q} onClick={() => {
                setMessages(prev => [...prev, { from: "user", text: q }]);
                setTyping(true);
                setTimeout(() => {
                  setMessages(prev => [...prev, { from: "bot", text: getBotReply(q) }]);
                  setTyping(false);
                }, 1000);
              }}
                className="flex-shrink-0 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors border border-emerald-200">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button onClick={sendMessage}
              className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50">
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">1</span>
        )}
      </button>
    </>
  );
}
