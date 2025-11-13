import React from 'react'

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            왜 <span className="text-gradient">FAN:STAGE</span>가 필요한가요?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            현재 음악 산업의 구조적 문제점과 팬들의 답답함
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* 아티스트 측면 문제 */}
          <div className="bg-red-50 rounded-2xl p-8 border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">아티스트의 고민</h3>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>마케팅 비용 없이는 바이럴 불가능</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>자신만의 색을 유지하기보다 유행 따라가기에 급급</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>트렌드에 획일화되는 음악 생산 (실리카겔, 멈블랩 등)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>자본력 없이는 팬베이스 구축 어려움</span>
              </li>
            </ul>
          </div>

          {/* 팬 측면 문제 */}
          <div className="bg-blue-50 rounded-2xl p-8 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">팬의 답답함</h3>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>좋아하는 아티스트를 응원하고 싶지만 효과적인 방법 부족</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>기존 SNS는 내 팔로워만 보는 닫힌 공간</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>새로운 아티스트 발견 채널 부족 (알고리즘은 인기곡 중심)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>내가 발굴한 아티스트를 자랑하고 싶은 욕구</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 시장 기회 */}
        <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">시장 기회</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-4xl font-bold mb-2">100만+</div>
                <div className="text-primary-100">팬딩 가입자</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">월 20억원</div>
                <div className="text-primary-100">팬덤 플랫폼 매출</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">2000만원+</div>
                <div className="text-primary-100">상위 크리에이터 월 수익</div>
              </div>
            </div>
            <p className="mt-8 text-lg text-primary-50">
              팬덤 플랫폼 시장의 잠재력이 이미 입증되었습니다. 
              <br />
              이제 음악 특화 커뮤니티가 필요합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
