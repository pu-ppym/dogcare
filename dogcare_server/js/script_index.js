const uls = document.querySelectorAll("ul");

uls.forEach((ul) => {
  const lis = ul.querySelectorAll("li");

  lis.forEach((li) => {
    li.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const url = target.getAttribute("data-href"); // data-href 속성에서 URL을 가져옵니다.

      // data-href 속성에 저장된 URL로 이동
      if (url) {
        window.location.href = url; 
      }
    });
  });

  // 현재 페이지 URL을 확인하고 해당 메뉴에 active 클래스를 추가합니다
  const currentUrl = window.location.pathname;

  lis.forEach((li) => {
    const liUrl = li.getAttribute("data-href");

    // 현재 페이지 URL과 data-href 값이 일치하면 해당 li에 active 클래스를 추가
    if (currentUrl === liUrl) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
  });

});