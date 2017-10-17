jQuery(document).ready(($) => {
  const duration = 300 // 애니메이션을 실행할 시간
  const delay = 300 // 
  const epsilon = (1000 / 60 / duration) / 4
  const firstCustomMinaAnimation = bezier(.42,.03,.77,.63, epsilon)
  const secondCustomMinaAnimation = bezier(.27,.5,.6,.99, epsilon)
  const initSlider = sliderWrapper => {
		//cache jQuery objects
		const slider = sliderWrapper.find('.slider'),
			sliderNavigation = sliderWrapper.find('.slider-navigation').find('li'),
			svgCoverLayer = sliderWrapper.find('div.svg-cover'),
			pathId = svgCoverLayer.find('path').attr('id'),
			svgPath = Snap('#'+pathId);
		//store path 'd' attribute values	
		var pathArray = [];
		pathArray[0] = svgCoverLayer.data('step1');
		pathArray[1] = svgCoverLayer.data('step6');
		pathArray[2] = svgCoverLayer.data('step2');
		pathArray[3] = svgCoverLayer.data('step7');
		pathArray[4] = svgCoverLayer.data('step3');
		pathArray[5] = svgCoverLayer.data('step8');
		pathArray[6] = svgCoverLayer.data('step4');
		pathArray[7] = svgCoverLayer.data('step9');
		pathArray[8] = svgCoverLayer.data('step5');
		pathArray[9] = svgCoverLayer.data('step10');	

		//update visible slide when user clicks .slider-navigation buttons
		sliderNavigation.on('click', function(event) {
			event.preventDefault();
			const selectedItem = $(this);
			if(!selectedItem.hasClass('selected')) {
				// if it's not already selected
				const selectedSlidePosition = selectedItem.index(),
					selectedSlide = slider.children('li').eq(selectedSlidePosition),
					visibleSlide = slider.find('.visible'),
					visibleSlidePosition = visibleSlide.index()
				const direction = visibleSlidePosition < selectedSlidePosition;
				updateSlide(visibleSlide, selectedSlide, direction, svgCoverLayer, sliderNavigation, pathArray, svgPath);
			}
		});
	}
  initSlider($('.slider-wrapper').last())
  const updateSlide = (oldSlide, newSlide, direction, svgCoverLayer, sliderNavigation, paths, svgPath) => {
    let path1, path2, path3, path4, path5
		if(direction) {
			  path1 = paths[0]
				path2 = paths[2]
				path3 = paths[4]
				path4 = paths[6]
				path5 = paths[8]
		} else {
			  path1 = paths[1]
				path2 = paths[3]
				path3 = paths[5]
				path4 = paths[7]
				path5 = paths[9]
    }
    svgCoverLayer.addClass('is-animating') // animating 중이라고 Class를 달아준다.
		const anime1 = () => new Promise(resolve => {
			svgPath.attr('d', path1)
			resolve()
    })
    const anime2 = () => new Promise(resolve => {
			svgPath.animate({'d': path2}, duration, firstCustomMinaAnimation, resolve)
		})
		const anime3 = () => new Promise(resolve => {
			svgPath.animate({'d': path3}, duration, secondCustomMinaAnimation, resolve)
		})
		const changeSlide = () => new Promise(resolve => {
			oldSlide.removeClass('visible');
			newSlide.addClass('visible');
			updateNavSlide(newSlide, sliderNavigation);
			setTimeout(function(){
				svgPath.animate({'d': path4}, duration, firstCustomMinaAnimation, function(){
					svgPath.animate({'d': path5}, duration, secondCustomMinaAnimation, function(){
						svgCoverLayer.removeClass('is-animating');
					});
				});
			}, delay);
    })
    const anime4 = () => new Promise(resolve => {
      svgPath.animate({'d': path4}, duration, firstCustomMinaAnimation, resolve)
    })
    const anime5 = () => new Promise(resolve => {
      svgPath.animate({'d': path5}, duration, secondCustomMinaAnimation, () => {
        svgCoverLayer.removeClass('is-animating')
      })
    })
		anime1()
    .then(anime2)
    .then(anime3)
    .then(changeSlide)
    .then(anime4)
    .then(anime5)
  }
  const updateNavSlide = (actualSlide, sliderNavigation) => {
		sliderNavigation.removeClass('selected').eq(actualSlide.index()).addClass('selected');
  }
})
