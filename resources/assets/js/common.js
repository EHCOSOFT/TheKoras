
$(document).ready(function () {
    var windowWidth = $(window).width();
    // 스크롤 이벤트 핸들러
    var header = $('.header'); // 헤더 선택
    var scrolled = false; // 스크롤 여부를 추적하는 변수

    // 스크롤 이벤트 핸들러
    $(window).on('scroll', function () {
        // 페이지의 스크롤 위치가 50px 이상일 때
        if ($(this).scrollTop() > 50) {
            header.addClass('active'); // .active 클래스 추가
            scrolled = true; // 스크롤됨을 표시
        } else {
            header.removeClass('active'); // .active 클래스 제거
            scrolled = false; // 스크롤되지 않은 상태로 표시
        }
    });

    function toggleMenu(parentLi, subMenu) {
        // 다른 <li>에서 active 클래스 제거 및 하위 메뉴 닫기 (현재 클릭한 메뉴 제외)
        $(".depth-01 > li").not(parentLi).removeClass("active");
        $(".depth-01 > li .depth-02").not(subMenu).removeClass("active").css({ display: "none" });

        // 현재 클릭한 <li>의 active 추가/제거 (토글)
        parentLi.toggleClass("active");

        if (subMenu.length) { // 하위 메뉴가 존재하면
            if (subMenu.hasClass("active")) {
                subMenu.removeClass("active").animate({ opacity: 0 }, 300, function () {
                    $(this).css("display", "none"); // 애니메이션 후 숨김 처리
                });
            } else {
                subMenu.css({ display: "flex", opacity: 0 }) // 초기 상태 설정 (투명, flex 적용)
                    .animate({ opacity: 1 }, 300) // 서서히 나타나도록 애니메이션 적용
                    .addClass("active");
            }
        }
    }

    if (windowWidth <= 992) {
        // 📱 **모바일 이벤트 (클릭)**

        // 공통 상단
        var menu = $(".header-navbar .depth-01");
        var scrollAmount = 100; // 이동 속도
        var navbarWrap = $(".header-navbar-wrap");
        var prevButton = $(".header-nav-prev");
        var nextButton = $(".header-nav-next");

        // 상단 서브 메뉴
        $(".depth-01 > li > a").on("click", function (e) {
            e.preventDefault(); // 기본 링크 동작 방지 (페이지 이동 방지)
            var parentLi = $(this).parent("li"); // 클릭한 <a>의 부모 <li> 찾기
            var subMenu = parentLi.find(".depth-02"); // <li> 안의 하위 메뉴(.depth-02) 찾기
            toggleMenu(parentLi, subMenu);

            var parentOffset = parentLi.position().left; // <li>의 위치 (부모 메뉴 내부 기준)
            // 스크롤 위치에 따라 왼쪽 또는 오른쪽 정렬 결정
            if (parentOffset >= 150) {
                subMenu.css({
                    left: "auto",
                    right: 8 // 150px 이상이면 오른쪽 정렬
                });
            } else {
                subMenu.css({
                    left: 8, // 150px 미만이면 왼쪽 정렬
                    right: "auto"
                });
            }
        });

        // 상단 서브 메뉴 스크롤 이벤트 시 여백
        function checkScroll() {
            if (menu.scrollLeft() <= 0) {
                prevButton.hide();
                navbarWrap.css("padding", "0 var(--space-32-xl) 0 0");
            } else {
                prevButton.show();
                navbarWrap.css("padding", "0 var(--space-32-xl)");
            }
        }
        checkScroll();

        // 상단 서브 메뉴 스크롤 이벤트 시 서브메뉴 닫기
        function closeDepth02() {
            $(".depth-02.active").removeClass("active").css({ opacity: 0, display: "none" });
        }

        // 상단 서브 메뉴 스크롤 버튼 클릭 시
        nextButton.on("click", function () {
            closeDepth02();
            menu.animate({ scrollLeft: "+=" + scrollAmount }, 300, checkScroll);
        });

        prevButton.on("click", function () {
            closeDepth02();
            menu.animate({ scrollLeft: "-=" + scrollAmount }, 300, checkScroll);
        });

    } else {
        // 💻 **PC 이벤트 (클릭 + 호버)**
        $(".depth-01 > li").on("mouseenter", function () {
            var parentLi = $(this);
            var subMenu = parentLi.find(".depth-02");

            // 마우스를 올렸을 때 메뉴 열기
            toggleMenu(parentLi, subMenu);
        });

        $(".depth-01 > li").on("mouseleave", function () {
            var parentLi = $(this);
            var subMenu = parentLi.find(".depth-02");

            // 마우스를 벗어나면 메뉴 닫기
            subMenu.animate({ opacity: 0 }, 300, function () {
                $(this).css("display", "none");
                parentLi.removeClass("active");
            });
        });

        // PC에서는 클릭하면 메뉴 고정
        $(".depth-01 > li > a").on("click", function (e) {
            e.preventDefault();
            var parentLi = $(this).parent("li");
            var subMenu = parentLi.find(".depth-02");
            toggleMenu(parentLi, subMenu);

            var parentOffset = 0;
            // 스크롤 위치에 따라 왼쪽 또는 오른쪽 정렬 결정
            if (parentOffset) {
                subMenu.css({
                    left: "50%",
                    right: "auto"
                });
            } else {
                subMenu.css({
                    left: "50%",
                    right: "auto"
                });
            }
        });
    }

    // ✨ **외부 클릭 시 메뉴 닫기**
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".depth-01 > li").length) {
            $(".depth-02").css({ opacity: 0, display: "none" });
            $(".depth-01 > li").removeClass("active");
        }
    });


    var mainVisualSwiper = new Swiper(".main-visual-swiper", {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        on: {
            autoplayTimeLeft(s, time, progress) {
                document.querySelector(".progress-fill").style.width = `${(1 - progress) * 100}%`;
            },
            slideChange: function () {
                let currentIndex = mainVisualSwiper.realIndex + 1;
                $(".progress-text").first().text(currentIndex);
            }
        }
    });

    var isAutoplaying = true; // 초기값: autoplay가 실행 중

    $(".autoplay-stop").on("click", function () {
        if (isAutoplaying) {
            mainVisualSwiper.autoplay.stop();
            $(this).html('<img src="img/ico/i-stop.svg" alt="자동재생 멈춤">'); // 버튼 텍스트 변경 (▶: 재생)
        } else {
            mainVisualSwiper.autoplay.start();
            $(this).html('<img src="img/ico/i-stop.svg" alt="자동재생 멈춤">');; // 버튼 텍스트 변경 (■: 정지)
        }
        isAutoplaying = !isAutoplaying; // 상태 반전
    });

    var mainSec10Swiper = new Swiper(".main-sec-10-swiper", {
        // 모바일 (768px 이하)
        slidesPerView: 1.2,
        spaceBetween: 12, // 슬라이드 간 여백 축소
        slidesOffsetBefore: 0, // 시작 전 여백 축소
        slidesOffsetAfter: 0,
        loop: true, // 무한 롤링 효과 추가
        speed: 4000, // 슬라이드 이동 속도
        autoplay: {
            delay: 0, // 딜레이 없이 계속 움직이도록 설정
            disableOnInteraction: false
        },
        centeredSlides: false, // 중앙 정렬
        allowTouchMove: false, // 사용자가 직접 드래그하지 못하도록 설정
        breakpoints: {
            500: {
                slidesPerView: 1.5,
                spaceBetween: 12, // 슬라이드 간 여백 축소
                slidesOffsetBefore: 0, // 시작 전 여백 축소
                slidesOffsetAfter: 0  // 끝 부분 여백 축소
            },
            768: {
                slidesPerView: 2.5,
                spaceBetween: 12, // 슬라이드 간 여백 축소
                slidesOffsetBefore: 0, // 시작 전 여백 축소
                slidesOffsetAfter: 0  // 끝 부분 여백 축소
            },// 태블릿 (768px ~ 1024px)
            992: {
                slidesPerView: 3,
                spaceBetween: 12, // 슬라이드 간 여백
                slidesOffsetBefore: 0, // 시작 전 여백
                slidesOffsetAfter: 0  // 끝 부분 여백
            },
            // 데스크탑 (1024px 이상)
            1400: {
                slidesPerView: 3,
                spaceBetween: 12, // 기본 여백
                slidesOffsetBefore: 0, // 기본 시작 여백
                slidesOffsetAfter: 0  // 기본 끝 여백
            },
            1600: {
                slidesPerView: 5,
                spaceBetween: 12,
                slidesOffsetBefore: 0, // 기본 시작 여백
                slidesOffsetAfter: 0  // 기본 끝 여백
            }
        }
    });

    // 마우스를 올리면 자동 슬라이드 멈추기
    $(".main-sec-10-swiper").on("mouseenter", function () {
        mainSec10Swiper.autoplay.stop(); // Swiper 자동 재생 멈춤
    });

    // 마우스를 벗어나면 자동 슬라이드 다시 시작
    $(".main-sec-10-swiper").on("mouseleave", function () {
        mainSec10Swiper.autoplay.start(); // Swiper 자동 재생 다시 시작
    });

    var mainSec17Swiper = new Swiper(".main-sec-17-swiper", {
        // 모바일 (768px 이하)
        slidesPerView: 1.2,
        spaceBetween: 12, // 슬라이드 간 여백 축소
        slidesOffsetBefore: 0, // 시작 전 여백 축소
        slidesOffsetAfter: 0,
        loop: true, // 무한 롤링 효과 추가
        speed: 4000, // 슬라이드 이동 속도
        autoplay: {
            delay: 0, // 딜레이 없이 계속 움직이도록 설정
            disableOnInteraction: false
        },
        centeredSlides: false, // 중앙 정렬
        allowTouchMove: false, // 사용자가 직접 드래그하지 못하도록 설정
        breakpoints: {
            500: {
                slidesPerView: 1.5,
                spaceBetween: 12, // 슬라이드 간 여백 축소
                slidesOffsetBefore: 0, // 시작 전 여백 축소
                slidesOffsetAfter: 0  // 끝 부분 여백 축소
            },
            768: {
                slidesPerView: 2.5,
                spaceBetween: 12, // 슬라이드 간 여백 축소
                slidesOffsetBefore: 0, // 시작 전 여백 축소
                slidesOffsetAfter: 0  // 끝 부분 여백 축소
            },// 태블릿 (768px ~ 1024px)
            992: {
                slidesPerView: 4,
                spaceBetween: 12, // 슬라이드 간 여백
                slidesOffsetBefore: 0, // 시작 전 여백
                slidesOffsetAfter: 0  // 끝 부분 여백
            },
            // 데스크탑 (1024px 이상)
            1400: {
                slidesPerView: 5,
                spaceBetween: 12, // 기본 여백
                slidesOffsetBefore: 0, // 기본 시작 여백
                slidesOffsetAfter: 0  // 기본 끝 여백
            },
            1600: {
                slidesPerView: 6,
                spaceBetween: 12,
                slidesOffsetBefore: 0, // 기본 시작 여백
                slidesOffsetAfter: 0  // 기본 끝 여백
            }
        }
    });
});


