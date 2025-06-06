/* TODO: 임시저장 기능 구현하기
구상을 해봅시다

임시저장 버튼을 누르면
목록들이 나오는데

제목하고 시간
이렇게 보여줘야겠죠

누르면 post에 덮어쓰기 되는건 구현하기 쉽긴할듯

key를 저 두개로 한다 치고
저장해야할게 이제
title
en_title
tags
post

정도겠죠
이것들 오브젝트로 집어넣으면 될듯

저장주기는? 흠 이것도 그 editor에 onChange있는데 그거에다 debounce 달아서
쓰면 될듯?

그리고 post하면 같은 포스트 임시저장된건 삭제시키고 -> 그러러면 postid도 key에 저장해야하나 흠

기간이 오래지난것도 삭제시키고 -> 그냥 editor 딱 커졌을때 한번 작동시키면 될듯

UI는 그 tag selector 참고하면 될듯 비슷하니깐 검색기능빼면 ㅇㅇ

idb_keyval로 저장하고 불러오고 하면 될듯
*/

export default function AutoSave() {
  return <button className="w-min whitespace-nowrap hover:underline">임시저장(2)</button>;
}
