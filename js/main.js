$(function () {
    const sticky = '.sticky-content';
    stickyContent(sticky);
});

function stickyContent(target) {
    if ($(target).length) {
        $(target).each(function () {
            const $this = $(this);
            const thisParent = $this.parent();
            const $window = $(window);
            let allStickyBlocks = $('.sticky-block');
            let scrolledTop = null;
            let contentParams = {
                offsetTop: $this.offset().top,
                offsetLeft: $this.offset().left,
                height: $this.outerHeight(),
                width: $this.outerWidth(),
                positionTop: 0
            };
            const relativeParent = $this.closest('#content');
            let relativeParentHeight = relativeParent.outerHeight();
            const stickyClass = 'is-sticky';
            let isSticky = false;
            let slided = false;
            let heightOffset = relativeParentHeight - contentParams.height;
            let isFit = false;
            let summaryStickyHeight = contentParams.height;
            const animationSpeed = 500;

            const sticky = function () {
                $this.addClass(stickyClass);
                $this.css({
                    'position': 'fixed',
                    'top': contentParams.positionTop + 'px',
                    'left': contentParams.offsetLeft + 'px',
                    'width': contentParams.width + 'px'
                });
                thisParent.css('padding-top', contentParams.height + 'px');
                isSticky = true;
            };

            const unstick = function () {
                $this.removeClass(stickyClass);
                $this.css({
                    'position': 'relative',
                    'top': '0',
                    'left': '0',
                    'width': ''
                });
                thisParent.css('padding-top', 0 + 'px');
                isSticky = false;
            };

            const slideUp = function () {
                $this.animate({
                    top: -contentParams.height + 'px'
                }, animationSpeed, 'linear');
            };

            const slideDown = function () {
                $this.animate({
                    top: contentParams.positionTop + 'px'
                }, animationSpeed, 'linear', function () {
                    if (!$this.hasClass(stickyClass)) {
                        $this.css('top', '0px');
                    }
                });
            };

           const refreshSticky = function(){
               allStickyBlocks.each(function (index) {
                   if ($this[0] === allStickyBlocks[index]) {
                       if (allStickyBlocks[index - 1]) {
                           let prevSticky = $(allStickyBlocks[index - 1]);
                           contentParams.positionTop = prevSticky.outerHeight();
                           contentParams.offsetTop = prevSticky.offset().top;
                           heightOffset = relativeParentHeight - contentParams.height - prevSticky.outerHeight();
                           summaryStickyHeight = contentParams.height + prevSticky.outerHeight();
                       }
                       else if(allStickyBlocks[index + 1]){
                           let nextSticky = $(allStickyBlocks[index + 1]);
                           summaryStickyHeight = contentParams.height + nextSticky.outerHeight();
                       }
                   }
               });
           };

            $this.addClass('sticky-block');

            if ($window.width() < 1200) {
                allStickyBlocks.push($this[0]);
                refreshSticky();
            }

            $window.height() < summaryStickyHeight ? isFit = false : isFit = true;

            $window.scroll(function () {
                scrolledTop = $window.scrollTop();
                if (scrolledTop > contentParams.offsetTop && isFit) {
                    if (!isSticky) {
                        sticky();
                    }
                    if (scrolledTop > heightOffset) {
                        if (!slided) {
                            slideUp();
                            slided = true;
                        }
                    }
                    else {
                        if (slided) {
                            slideDown();
                            slided = false;
                        }
                    }
                }
                else {
                    if (isSticky) {
                        unstick();
                    }
                }
            });

            $window.on('resize orientationchange', function () {
                if (isSticky) {
                    unstick();
                }
                contentParams.offsetLeft = $this.offset().left;
                contentParams.height = $this.outerHeight();
                contentParams.width = $this.outerWidth();
                relativeParentHeight = relativeParent.outerHeight();
                if ($window.width() < 1200) {
                    allStickyBlocks = $('.sticky-block');
                    refreshSticky();
                }
                else {
                    contentParams.offsetTop = $this.offset().top;
                    contentParams.positionTop = 0;
                    heightOffset = relativeParentHeight - contentParams.height;
                    summaryStickyHeight = contentParams.height;
                }
                $window.height() < summaryStickyHeight ? isFit = false : isFit = true;
            });
        });
    }
}