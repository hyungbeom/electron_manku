import kakao_logo from '@/resources/image/logo/kakao_logo.png'
import naver_logo from '@/resources/image/logo/naver_logo.png'
import google_logo from '@/resources/image/logo/google_logo.png'
import category1 from '@/resources/image/category/m_1_vegetable.png'
import category2 from '@/resources/image/category/m_2_fruit.png'
import category3 from '@/resources/image/category/m_3_meat.png'
import category4 from '@/resources/image/category/m_4_marine.png'
import category5 from '@/resources/image/category/m_5_coffee.png'
import category6 from '@/resources/image/category/m_6_wine.png'
import category7 from '@/resources/image/category/m_7_mealkit.png'
import category8 from '@/resources/image/category/m_8_voucher.png'

export const snsSignUpList = {
    market: {id: 'market', text: '일반 회원가입', stroke: 'green4', background: 'green3', link: '/signUp'},
    blank: {},
    kakao: {id: 'kakao', text: '카카오로 회원가입', stroke: 'primary', src: kakao_logo},
    naver: {id: 'naver', text: '네이버로 회원가입', stroke: 'primary', src: naver_logo},
    google: {id: 'google', text: '구글로 회원가입', stroke: 'primary', src: google_logo},
}

export const snsLoginList = {
    kakao: {id: 'kakao', text: '카카오로 로그인', stroke: 'primary', src: kakao_logo},
    naver: {id: 'naver', text: '네이버로 로그인', stroke: 'primary', src: naver_logo},
    google: {id: 'google', text: '구글로 로그인', stroke: 'primary', src: google_logo},
}

export const signUpLabel = {
    email: {title: '아이디(이메일)*', placeholder: '아이디를 입력해주세요', id: 'email'},
    certNum: {title: '인증번호 입력*', placeholder: '인증번호 6자리 입력', id: 'certNum'},
    pw: {title: '비밀번호*', placeholder: '비밀번호를 입력해주세요', id: 'pw'},
    confirmPw: {title: '비밀번호 확인*', placeholder: '비밀번호를 한 번 더 입력해주세요', id: 'confirmPw'},
    name: {title: '이름*', placeholder: '이름을 입력해주세요', id: 'name'},
    phone: {title: '휴대폰*', placeholder: '휴대폰 번호를 입력해주세요', id: 'phone'},
}

export const editInfoLabel = {
    email: {title: '아이디(이메일)*', placeholder: '아이디를 입력해주세요', id: 'email'},
    name: {title: '이름', placeholder: '이름을 입력해주세요', id: 'name'},
    pw: {title: '현재 비밀번호', placeholder: '비밀번호를 입력해주세요', id: 'pw'},
    newPw: {title: '새 비밀번호', placeholder: '비밀번호를 한 번 더 입력해주세요', id: 'newPw'},
    confirmPw: {title: '비밀번호 확인', placeholder: '비밀번호를 한 번 더 입력해주세요', id: 'confirmPw'},
    gender: {title: '성별',id: 'email'},
    birthday: {title: '생년월일', placeholder: '이름을 입력해주세요', id: 'name'},
}

export const myPageMenu = {
    order: {id:'order', title:'주문 관리', location:'/'},
    delivery: {id:'delivery', title:'주문 배송 내역', location:'/'},
    reorder: {id:'reorder', title:'재구매', location:'/'},
    cancel: {id:'cancel', title:'주문 취소 내역', location:'/'},
    refund: {id:'refund', title:'반품 교환 내역', location:'/'},
    like: {id:'like', title:'찜한 상품', location:'/'},
    cash: {id:'cash', title:'시즌 캐쉬', location:'/'},
    coupon: {id:'coupon', title:'내 쿠폰', location:'/'},
    address: {id:'address', title:'배송지 관리', location:'/'},
    infoEdit: {id:'infoEdit', title:'개인 정보 수정', location:'/infoEdit'},
    logout: {id:'logout', title:'로그 아웃',location:'/'},
}

export const categoryList = [{title : '1인 소분용', categoryNo : 1, subCategoryNo : 2 }, {title : '제주특산', specificType : 'SPEC0020'}, {title : '제철상품', specificType : 'SPEC0010'}, {title : '밀키트', categoryNo : 7, subCategoryNo : 0}, {title : '시즌레시피'}, {title : '시즌마켓 와인', categoryNo : 6, subCategoryNo : 40}, {title : '시즌마켓 커피', categoryNo : 5, subCategoryNo : 37}, {title : '공동구매', categoryNo : 5, subCategoryNo : 37}]

export const categoryList2 = [
    {title : '채소', src : category1,
        children:[{title:'채소 전체', link:'/product'}, {title:'제주 제철 채소', link:'/product'}, {title:'제철 채소', link:'/product'}, {title:'못난이 채소', link:'/product'}, {title:'소분이 채소', link:'/product'}, {title:'스마트팜', link:'/product'}]},
    {title : '과일', src : category2,
        children:[{title:'과일 전체', link:'/product'}, {title:'제주 제철 과일', link:'/product'}, {title:'제철 과일', link:'/product'}, {title:'못난이 과일', link:'/product'}, {title:'소분이 과일', link:'/product'}, {title:'스마트팜', link:'/product'}]},
    {title : '축산물', src : category3,
        children:[{title:'육류 전체', link:'/product'}, {title:'제주 직송 육류', link:'/product'}, {title:'국산 육류', link:'/product'}, {title:'소분이 육류', link:'/product'}, {title:'수입 육류', link:'/product'}]},
    {title : '수산물', src : category4,
        children:[{title:'수산 전체', link:'/product'}, {title:'제주 직송 수산', link:'/product'}, {title:'국산 수산', link:'/product'}, {title:'소분이 수산', link:'/product'}, {title:'수입 수산', link:'/product'}]},
    {title : '시즌커피', src : category5,
        children:[{title:'커피 전체', link:'/product'}, {title:'원두', link:'/product'}, {title:'드립백', link:'/product'},]},
    {title : '시즌와인', src : category6,
        children:[{title:'와인 전체', link:'/product'}, {title:'레드', link:'/product'}, {title:'화이트', link:'/product'}, {title:'기타', link:'/product'}]},
    {title : '밀키트', src : category7, children:[{title:'밀키트 전체', link:'/product'}]},
    {title : '시즌상품권', src : category8, children:[{title:'시즌상품권 전체', link:'/product'}]},

]

export const alignCss = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}