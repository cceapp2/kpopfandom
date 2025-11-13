import React from 'react'

export default function DifferentiatorSection() {
  const competitors = [
    {
      name: "위버스",
      pros: "K-POP 아이돌 중심 강력한 팬덤",
      cons: "대형 기획사 아티스트만 입점 가능",
      diff: "인디/신인에게 문턱 낮은 플랫폼"
    },
    {
      name: "팬딩",
      pros: "크리에이터 자유 입점, 멤버십",
      cons: "음악 특화 기능 부족",
      diff: "음악 발견 알고리즘 강화"
    },
    {
      name: "스포티파이",
      pros: "뛰어난 음악 추천 알고리즘",
      cons: "커뮤니티 기능 약함",
      diff: "팬 큐레이션 + 알고리즘 결합"
    },
    {
      name: "유튜브",
      pros: "방대한 콘텐츠, 높은 접근성",
      cons: "음악 전문 커뮤니티 부재",
      diff: "음악 팬 전용 공간 제공"
    }
  ]

  return (
    <section id="differentiator" className="py-20 bg-gradient-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            왜 <span className="text-gradient">FAN:STAGE</span>인가요?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            경쟁사와의 차별화 포인트
          </p>
        </div>

        {/* 핵심 차별화 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-4">팬 큐레이션이 곧 발견 알고리즘</h3>
            <p className="text-gray-600 leading-relaxed">
              팬이 플레이리스트를 만들면 플랫폼 내 피드에 자동 노출됩니다. 다른 팬들의 재생과 좋아요가 많을수록 더 많은 노출을 받아 큐레이션 품질이 곧 영향력이 됩니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-2xl font-bold mb-4">연관 아티스트 자동 노출</h3>
            <p className="text-gray-600 leading-relaxed">
              아티스트 A를 좋아하면 A를 좋아한 다른 팬들이 좋아한 B, C를 자동 추천합니다. 내 피드에 내가 선택하지 않은 아티스트도 노출되는 열린 공간입니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-bold mb-4">아티스트 직접 소통</h3>
            <p className="text-gray-600 leading-relaxed">
              아티스트가 직접 피드를 작성하고 댓글에 답변하며, 신곡 발표와 공연 소식을 공유합니다. 팬과 아티스트가 함께 성장하는 커뮤니티입니다.
            </p>
          </div>
        </div>

        {/* 경쟁사 비교 */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <h3 className="text-3xl font-bold text-center mb-12">경쟁사와의 차이</h3>
          <div className="space-y-6">
            {competitors.map((competitor, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h4 className="text-xl font-bold">{competitor.name}</h4>
                  <span className="text-sm text-primary-600 font-semibold mt-1 md:mt-0">
                    FAN:STAGE 차별화: {competitor.diff}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="text-green-600 font-semibold text-sm">장점: </span>
                    <span className="text-gray-600 text-sm">{competitor.pros}</span>
                  </div>
                  <div>
                    <span className="text-red-600 font-semibold text-sm">단점: </span>
                    <span className="text-gray-600 text-sm">{competitor.cons}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
