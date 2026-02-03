
import React from 'react';
import { Mail, Phone, Instagram, MessageCircle, LayoutGrid, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/lotofphoto56/", name: "Instagram" },
    { icon: MessageCircle, href: "https://wa.me/966532470165", name: "WhatsApp" },
    { icon: LayoutGrid, href: "https://www.behance.net/a5b67ea4", name: "Behance" }
  ];

  return (
    <section id="contact" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600"></div>
      
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        <div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-glow text-right">
            تواصل معي!
          </h2>
          <div className="text-slate-400 text-lg mb-12 max-w-lg space-y-4">
            <p>
              يسعدني استقبال أي تواصل مهني أو استفسار يتعلق بالتصميم، التصوير، أو المشاريع الإبداعية والرقمية.
            </p>
            <p>
              أقدّر كل رسالة تصلني، وأتعامل معها باهتمام واحترام، سواء كانت فرصة عمل، تعاون، أو مجرد سؤال بسيط.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-all">
                <Mail className="text-purple-500 group-hover:text-white" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">البريد الإلكتروني</p>
                <a href="mailto:g-faky@hotmail.com" className="text-xl font-bold hover:text-purple-400">g-faky@hotmail.com</a>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-all">
                <Phone className="text-purple-500 group-hover:text-white" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">رقم التواصل</p>
                <a href="tel:+966532470165" className="text-xl font-bold hover:text-purple-400" dir="ltr">+966 53 247 0165</a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center text-center">
          <MessageSquare className="w-20 h-20 text-purple-600 mb-8 animate-pulse" />
          <h3 className="text-3xl font-black mb-6">تابعي أعمالي عبر الشبكات</h3>
          <div className="flex gap-4">
            {socialLinks.map((social, idx) => (
              <a 
                key={idx} 
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center hover:bg-purple-600 hover:-translate-y-2 transition-all border border-white/10"
                title={social.name}
              >
                <social.icon size={28} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
