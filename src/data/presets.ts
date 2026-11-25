import type { World } from '../types';

export const presetWorlds: World[] = [
  {
    id: 'preset-1',
    name: 'Làng Cổ Tích',
    description: 'Một ngôi làng yên bình ven rừng, nơi phép thuật nhẹ nhàng len lỏi qua từng ngọn cỏ.',
    lore: 'Truyền thuyết kể rằng, khu rừng Thì Thầm phía bắc ngôi làng từng là nơi trú ngụ của các nàng tiên. Người dân trong làng sống bằng nghề chăn nuôi và hái thuốc. Tuy nhiên, gần đây, những tiếng động lạ thường xuyên phát ra từ khu rừng vào ban đêm, khiến dân làng vô cùng lo lắng. Bạn là một lữ khách vô tình dừng chân tại đây.',
    startLocationId: 'loc-1',
    locations: [
      {
        id: 'loc-1',
        name: 'Quảng trường làng',
        description: 'Nơi tụ tập chính của dân làng, có một giếng nước cổ và cây đa lớn tỏa bóng mát.',
        connections: ['loc-2', 'loc-3'],
        ambient: 'Tiếng trẻ con nô đùa, mùi cỏ khô và khói bếp.',
      },
      {
        id: 'loc-2',
        name: 'Rừng Thì Thầm',
        description: 'Khu rừng rậm rạp, cây cối um tùm. Nghe nói có tiếng thì thầm của các linh hồn.',
        connections: ['loc-1'],
        ambient: 'Tối tăm, ẩm ướt, thỉnh thoảng có tiếng lá xào xạc dù không có gió.',
      },
      {
        id: 'loc-3',
        name: 'Tiệm thuốc của bà Hoa',
        description: 'Một căn nhà nhỏ nồng mùi thảo dược. Bà Hoa là người chữa bệnh duy nhất ở đây.',
        connections: ['loc-1'],
        ambient: 'Mùi thảo dược, tiếng lách cách của cối giã thuốc.',
      }
    ],
    entities: [
      {
        id: 'ent-1',
        name: 'Trưởng làng',
        role: 'npc',
        description: 'Một ông già râu tóc bạc phơ, vẻ mặt nghiêm nghị nhưng ánh mắt hiền từ.',
        traits: ['Nghiêm khắc', 'Lo lắng cho dân làng'],
        locationId: 'loc-1'
      },
      {
        id: 'ent-2',
        name: 'Bà Hoa',
        role: 'npc',
        description: 'Bà cụ bán thuốc, am hiểu về các loại cây cỏ và phép thuật dân gian.',
        traits: ['Bí ẩn', 'Tốt bụng'],
        locationId: 'loc-3'
      }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPreset: true,
  },
  {
    id: 'preset-2',
    name: 'Sài Gòn 2099',
    description: 'Thành phố tương lai chia làm hai tầng: Tầng trên của người giàu và tầng dưới của dân nghèo.',
    lore: 'Sài Gòn năm 2099 không còn những hàng cây xanh mà thay vào đó là các tòa nhà chọc trời bằng kính và kim loại. Tầng trên (Upper City) là thiên đường của giới thượng lưu với không khí sạch và ánh sáng rực rỡ. Tầng dưới (Lower City) là nơi bạn đang sống, ngập trong khói bụi, tội phạm và những quán bar neon chập chờn. Bạn là một thợ sửa chip nghèo, vừa vô tình sở hữu một thiết bị chứa bí mật động trời.',
    startLocationId: 'loc-sg1',
    locations: [
      {
        id: 'loc-sg1',
        name: 'Chợ đêm Bến Thành',
        description: 'Khu chợ nhộn nhịp bậc nhất tầng dưới. Ai cũng có thể mua bán mọi thứ, kể cả các bộ phận cơ thể.',
        connections: ['loc-sg2', 'loc-sg3'],
        ambient: 'Tiếng rao bán hàng chói tai, ánh đèn neon đủ màu sắc, mùi dầu máy.',
      },
      {
        id: 'loc-sg2',
        name: 'Quán bar Neon',
        description: 'Nơi tụ tập của dân anh chị và các hacker mũ đen.',
        connections: ['loc-sg1'],
        ambient: 'Tiếng nhạc synthwave đinh tai nhức óc, mùi rượu và khói thuốc.',
      },
      {
        id: 'loc-sg3',
        name: 'Hẻm 47',
        description: 'Khu ổ chuột tối tăm, nơi bạn có một căn phòng trọ tồi tàn.',
        connections: ['loc-sg1'],
        ambient: 'Ẩm thấp, tối tăm, thỉnh thoảng có tiếng súng lạc.',
      }
    ],
    entities: [
      {
        id: 'ent-sg1',
        name: 'Hacker mũ đen',
        role: 'npc',
        description: 'Một thanh niên mặc áo khoác da, tay gắn chip điều khiển từ xa.',
        traits: ['Lanh lợi', 'Tham lam', 'Giỏi công nghệ'],
        locationId: 'loc-sg2'
      },
      {
        id: 'ent-sg2',
        name: 'Bartender',
        role: 'npc',
        description: 'Người pha chế đồ uống ở quán bar Neon, có vẻ ngoài lạnh lùng.',
        traits: ['Ít nói', 'Quan sát tốt'],
        locationId: 'loc-sg2'
      }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPreset: true,
  },
  {
    id: 'preset-3',
    name: 'Biệt Thự Đêm Mưa',
    description: 'Một nhóm bạn bị kẹt trong biệt thự cổ giữa cơn bão lớn. Và rồi, một người chết.',
    lore: 'Bạn và 4 người bạn nhận lời mời đến dự tiệc tại biệt thự của một tỷ phú bí ẩn nằm sâu trong khu rừng. Đêm hôm đó, cơn bão ập đến dữ dội, làm sập cầu và cắt đứt mọi liên lạc với bên ngoài. Vào lúc nửa đêm, tiếng hét thất thanh vang lên từ thư viện. Người chủ biệt thự đã chết, và kẻ sát nhân chắc chắn vẫn đang ở trong nhà.',
    startLocationId: 'loc-bt1',
    locations: [
      {
        id: 'loc-bt1',
        name: 'Sảnh chính',
        description: 'Căn phòng rộng lớn với chiếc đèn chùm pha lê lấp lánh và cầu thang gỗ dẫn lên lầu.',
        connections: ['loc-bt2', 'loc-bt3'],
        ambient: 'Tiếng mưa đập vào cửa sổ, tiếng đồng hồ quả lắc tích tắc.',
      },
      {
        id: 'loc-bt2',
        name: 'Thư viện',
        description: 'Nơi xảy ra án mạng. Sách vở văng tung tóe, cửa sổ mở toang.',
        connections: ['loc-bt1'],
        ambient: 'Mùi máu tanh nồng, gió lạnh lùa vào.',
      },
      {
        id: 'loc-bt3',
        name: 'Hầm rượu',
        description: 'Nơi chứa những chai rượu vang đắt tiền. Tối tăm và ẩm thấp.',
        connections: ['loc-bt1'],
        ambient: 'Mùi ẩm mốc và mùi rượu nồng nặc.',
      }
    ],
    entities: [
      {
        id: 'ent-bt1',
        name: 'Quản gia',
        role: 'npc',
        description: 'Một người đàn ông trung niên, nét mặt không cảm xúc.',
        traits: ['Điềm tĩnh', 'Trung thành', 'Che giấu bí mật'],
        locationId: 'loc-bt1'
      },
      {
        id: 'ent-bt2',
        name: 'Cô thư ký',
        role: 'npc',
        description: 'Cô gái trẻ xinh đẹp, đang vô cùng hoảng sợ.',
        traits: ['Yếu đuối', 'Dễ bị thao túng'],
        locationId: 'loc-bt1'
      }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPreset: true,
  }
];