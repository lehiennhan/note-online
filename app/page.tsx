'use client';

import { Mail, Phone, Github, Download, MessageCircle, Facebook } from 'lucide-react';

export default function ProfilePage() {
  const skills = [
    'C#',
    'TypeScript',
    'React',
    'Vue',
    'Next.js',
    'Nuxt.js',
    'Tailwind CSS',
    'Firebase',
    'Node.js',
    'Express.js',
    'PostgreSQL',
    'Git',
    'Go',
    'Docker',
    "Terraform",
    "AWS",
    "CI/CD",
    "Gitlab CI/CD",
    "ArgoCD",
    "日本語",
    "English",
    "한국인",
  ];

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'lehiennhan2000@gmail.com', href: 'mailto:lehiennhan2000@gmail.com' },
    { icon: Phone, label: 'Phone', value: '+84 (0) 902 569 407', href: 'tel:+84902569407' },
    { icon: MessageCircle, label: 'Discord', value: 'blacksheep', href: 'https://discord.com' },
    { icon: Github, label: 'GitHub', value: 'lehiennhan', href: 'https://github.com/lehiennhan' },
    { icon: Facebook, label: 'Facebook', value: 'Nhan Le', href: 'https://facebook.com/gendeath' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1e1e2e] via-[#313244] to-[#1e1e2e] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <section className="bg-[#313244] rounded-2xl shadow-2xl p-8 mb-8 border border-[#45475a]">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-[#cba6f7] to-[#89dceb] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-[#1e1e2e]">🧑‍💼</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-[#cdd6f4] mb-2">Nhan Le</h1>
              <p className="text-xl text-[#cba6f7] mb-4">Full Stack Developer</p>
              <p className="text-[#a6adc8] mb-6 max-w-2xl">
                Passionate about building beautiful and functional web applications.
                Experienced in modern JavaScript frameworks and cloud technologies.
              </p>
              <button className="bg-[#cba6f7] hover:bg-[#f5c2e7] text-[#1e1e2e] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                <Download size={20} />
                Download CV
              </button>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-[#313244] rounded-2xl shadow-2xl p-8 mb-8 border border-[#45475a]">
          <h2 className="text-3xl font-bold text-[#cdd6f4] mb-6 flex items-center gap-2">
            <span className="text-[#cba6f7]">🛠️</span> Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#45475a] to-[#313244] rounded-lg p-4 text-center border border-[#585b70] hover:border-[#cba6f7] transition-colors group cursor-pointer"
              >
                <p className="text-[#cdd6f4] group-hover:text-[#cba6f7] font-semibold transition-colors">
                  {skill}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-[#313244] rounded-2xl shadow-2xl p-8 border border-[#45475a]">
          <h2 className="text-3xl font-bold text-[#cdd6f4] mb-6 flex items-center gap-2">
            <span className="text-[#cba6f7]">📞</span> Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <a
                  key={index}
                  href={info.href}
                  className="flex items-center gap-4 p-4 rounded-lg bg-[#45475a] hover:bg-[#585b70] transition-colors border border-[#585b70] hover:border-[#cba6f7] group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={24} className="text-[#cba6f7] group-hover:text-[#f5c2e7] transition-colors" />
                  <div>
                    <p className="text-xs uppercase text-[#a6adc8] font-semibold">{info.label}</p>
                    <p className="text-[#cdd6f4] group-hover:text-[#cba6f7] transition-colors">
                      {info.value}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

