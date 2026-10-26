import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Send,
  MessageSquare,
  CheckCircle2,
  Users,
} from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';

export const AboutPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General Feedback',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-16">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-orange-50/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-black uppercase tracking-widest text-orange-600 block mb-3">
            Our Story & Values
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 font-['Outfit'] tracking-tight mb-6">
            Empowering Neighborhood Kitchens & Delightful Dining.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            FoodX was founded with a singular purpose: connecting passionate food creators with lovers of fresh, artisan cuisine through transparent technology and lightning-fast logistics.
          </p>
        </div>
      </section>

      {/* 2. MISSION & VISION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-['Outfit'] mb-3">
                Our Mission
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                To eliminate the distance between cravings and culinary mastery by building a hyper-efficient, respectful, and reliable food network that empowers local kitchens to flourish while delighting customers every single day.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-['Outfit'] mb-3">
                Our Vision
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                A world where every chef has direct access to customers, where quality food is transparently sourced, and where hyperlocal delivery operates with surgical precision, environmental consciousness, and warm human care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-orange-600 block mb-1">
            The FoodX Difference
          </span>
          <h2 className="text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            Why Foodies Love Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Clock,
              title: '30-Minute Guarantee',
              desc: 'Dedicated driver allocation ensures hot delivery straight from kitchen pans to your table.',
            },
            {
              icon: ShieldCheck,
              title: '100% Quality Audited',
              desc: 'Every restaurant on our platform is physically inspected for hygiene and authentic recipes.',
            },
            {
              icon: Users,
              title: 'Empowering Partners',
              desc: 'Lowest commission rates in the industry, keeping your favorite restaurants thriving.',
            },
            {
              icon: Sparkles,
              title: 'Live Tracking',
              desc: 'Real-time order progression from chef prep to doorstep dropoff.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEEDBACK & CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-orange-600 block mb-1">
                Reach Out
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
                Get In Touch
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Have questions about partnership, feedback on your recent meal, or press inquiries? We are always happy to chat.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Call Us</p>
                  <p className="text-sm font-black text-slate-900">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Email Support</p>
                  <p className="text-sm font-black text-slate-900">support@foodx.io</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Headquarters</p>
                  <p className="text-sm font-black text-slate-900">Cyber Hub, Gurugram, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Feedback Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-['Outfit']">Customer Feedback</h3>
                <p className="text-xs text-slate-400">Share your thoughts on how we can improve</p>
              </div>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center flex flex-col items-center animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3" />
                <h4 className="text-lg font-black text-emerald-950">Thank You For Your Feedback!</h4>
                <p className="text-xs text-emerald-700 mt-1 max-w-sm">
                  We appreciate your thoughts. Note: General platform feedback is acknowledged locally as our backend currently supports direct restaurant reviews.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', topic: 'General Feedback', message: '' });
                  }}
                  className="mt-6 text-xs font-bold text-emerald-900 underline hover:text-emerald-950"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Feedback Topic
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option>General Feedback</option>
                    <option>App Usability & Suggestion</option>
                    <option>Delivery Speed</option>
                    <option>Restaurant Partnership Inquiry</option>
                  </select>
                </div>

                <Input
                  type="textarea"
                  label="Your Message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you liked or what we can do better..."
                />

                <div className="pt-2">
                  <Button type="submit" variant="primary" size="md" icon={Send} className="w-full">
                    Submit Feedback
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
