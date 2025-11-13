import React from 'react'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          지금 시작하세요
        </h2>
        <p className="text-xl md:text-2xl text-primary-50 mb-12 leading-relaxed">
          진짜 음악 팬이 아티스트를 발견하고 응원하는 새로운 경험
          <br />
          <span className="text-lg">무료로 시작하고, 지금 바로 음악 여정을 시작하세요</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="bg-white text-primary-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
            무료로 시작하기
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
            앱 다운로드
          </button>
        </div>

        {/* 엘리베이터 피치 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <p className="text-white text-lg leading-relaxed italic">
            "FAN:STAGE는 팬이 직접 아티스트를 큐레이팅하고, 그 큐레이션이 다른 팬들에게 자동으로 노출되는 음악 커뮤니티 플랫폼입니다. 
            자본 없는 인디 아티스트도 진짜 음악 팬의 응원으로 발견되고, 팬들은 자신이 발굴한 아티스트를 효과적으로 자랑할 수 있습니다."
          </p>
        </div>
      </div>
    </section>
  )
}
