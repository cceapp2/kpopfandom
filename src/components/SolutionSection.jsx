import React from 'react'

export default function SolutionSection() {
  return (
    <section id="solution" className="py-20 bg-gradient-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">FAN:STAGE</span>의 솔루션
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            팬이 만드는 음악 생태계로 아티스트와 팬을 연결합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">팬 큐레이션 피드</h3>
            <p className="text-gray-600 leading-relaxed">
              팬이 플레이리스트를 만들면 자동으로 피드에 게시됩니다. 다른 팬들의 재생과 좋아요가 많을수록 더 많은 노출을 받아 아티스트가 자연스럽게 발견됩니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">연관 아티스트 자동 추천</h3>
            <p className="text-gray-600 leading-relaxed">
              내가 좋아한 아티스트를 기반으로, 같은 아티스트를 좋아한 다른 팬들이 함께 좋아하는 아티스트를 자동으로 추천합니다. 닫힌 공간이 아닌 열린 발견의 공간입니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">아티스트 직접 소통</h3>
            <p className="text-gray-600 leading-relaxed">
              아티스트가 직접 피드를 작성하고 댓글에 답변하며, 신곡 발표와 공연 소식을 공유합니다. 팬과 아티스트가 함께 성장하는 커뮤니티를 만듭니다.
            </p>
          </div>
        </div>

        {/* 작동 방식 시각화 */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <h3 className="text-3xl font-bold text-center mb-12">어떻게 작동하나요?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h4 className="font-bold mb-2">팬이 플레이리스트 생성</h4>
              <p className="text-sm text-gray-600">좋아하는 아티스트의 곡으로 큐레이션</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h4 className="font-bold mb-2">자동으로 피드 노출</h4>
              <p className="text-sm text-gray-600">플레이리스트가 다른 팬들에게 자동 노출</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h4 className="font-bold mb-2">팬들의 반응</h4>
              <p className="text-sm text-gray-600">재생, 좋아요가 많을수록 더 많이 노출</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                4
              </div>
              <h4 className="font-bold mb-2">아티스트 발견</h4>
              <p className="text-sm text-gray-600">자본 없이도 자연스럽게 팬베이스 확장</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
