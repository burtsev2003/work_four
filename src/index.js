import Swiper, { Pagination } from 'swiper'
import 'swiper/swiper-bundle.css'
import './scss/index.scss'

Swiper.use({ Pagination })

const page = () => {
  const variables = {
    swipers: [],
    swiperContainers: [
      '.brands__swiper',
      '.periphery__swiper',
      '.price__swiper'
    ],
    swiperButtons: document.querySelectorAll('.button-show-content'),
    modalCallTitle: document.querySelector('.modal-call__title'),
    modalFeedbackTitle: document.querySelector('.modal-feedback__title'),
    scrollWidth: window.innerWidth - document.body.clientWidth
  }

  const swiper = () => {
    const priceTitles = document.querySelectorAll('.service-item__title')
    const breakpoint = window.matchMedia('(min-width:768px)')
    let swiperCount = variables.swiperContainers.length

    const breakpointChecker = () => {
      let ifHasSwipers = variables.swipers.length

      if (breakpoint.matches) {
        togglePriceTitles(true)
      }

      if (breakpoint.matches && ifHasSwipers) {
        return destroySwiper()
      } else if (!breakpoint.matches) {
        togglePriceTitles()
        return createSwiper()
      }
    }

    function togglePriceTitles(hide) {
      if (hide) {
        priceTitles.forEach((title) => {
          title.classList.add('visually-hidden')
        })
      } else {
        priceTitles.forEach((title) => {
          title.classList.remove('visually-hidden')
        })
      }
    }

    function destroySwiper() {
      for (let i = 0; i < swiperCount; i++) {
        variables.swipers[i].destroy()
      }
    }

    function createSwiper() {
      const newSwiper = (container) => {
        const newSwiper = new Swiper(container, {
          modules: [Pagination],
          loop: true,
          slidesPerView: 'auto',
          spaceBetween: 16,
          pagination: {
            el: '.swiper__pagination',
            type: 'bullets',
            clickable: true
          }
        })

        return newSwiper
      }

      for (let i = 0; i < swiperCount; i++) {
        variables.swipers[i] = newSwiper(variables.swiperContainers[i])
      }
    }

    breakpoint.addEventListener('change', breakpointChecker)
    breakpointChecker()
  }

  const overlay = () => {
    const burgerButton = document.querySelector('.burger-menu')
    const overlay = document.querySelector('.overlay')
    const aside = document.querySelector('.aside')
    const asideButtonClose = aside.querySelector('.aside__button-close')
    const modalCall = document.querySelector('.page__modal-call')
    const modalCallButtonClose = modalCall.querySelector(
      '.modal-call__button-close'
    )
    const modalFeedback = document.querySelector('.page__modal-feedback')
    const modalFeedbackButtonClose = modalFeedback.querySelector(
      '.modal-feedback__button-close'
    )
    const buttonCall = document.querySelectorAll('.contacts__button--call')
    const buttonFeedback = document.querySelectorAll(
      '.contacts__button-feedback'
    )

    const pageHeight = document.documentElement.scrollHeight

    const arrayPopupsForListener = [
      {
        button: burgerButton,
        section: aside,
        activeClass: 'aside--active'
      },
      {
        button: buttonCall,
        section: modalCall,
        activeClass: 'modal-call--active',
        needCloseMenu: true
      },
      {
        button: buttonFeedback,
        section: modalFeedback,
        activeClass: 'modal-feedback--active',
        needCloseMenu: true
      }
    ]

    const openPopup = (section, sectionClassActive, needCloseMenu) => {
      document.body.style.overflow = 'hidden'

      section.style.maxHeight = `${pageHeight}px`
      section.classList.add(sectionClassActive)
      overlay.classList.add('overlay--active')

      if (needCloseMenu) {
        closeMenu()
        overlay.style.zIndex = 3
      }
    }

    const closePopup = (needCloseMenu) => {
      ;[...document.forms].forEach((form) => {
        form.classList.remove('visually-hidden')
        form.style.opacity = 1
      })
      variables.modalCallTitle.style.opacity = 1
      variables.modalFeedbackTitle.style.opacity = 1
      variables.modalCallTitle.classList.remove('visually-hidden')
      variables.modalFeedbackTitle.classList.remove('visually-hidden')

      modalFeedback.classList.remove('modal-feedback--active')
      modalCall.classList.remove('modal-call--active')
      overlay.classList.remove('overlay--active')
      overlay.style.zIndex = ''
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''

      if (needCloseMenu) closeMenu()
    }

    const closeMenu = () => {
      aside.classList.remove('aside--active')
    }

    const openButtonsListeners = (data) => {
      data.forEach((popup) => {
        if (popup.button.length) {
          return popup.button.forEach((button) => {
            button.addEventListener('click', () => {
              openPopup(popup.section, popup.activeClass, popup.needCloseMenu)
            })
          })
        }
        popup.button.addEventListener('click', () => {
          openPopup(popup.section, popup.activeClass, popup.needCloseMenu)
        })
      })
    }

    const closeButtonsListener = (...buttons) => {
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          closePopup()
          if (button === asideButtonClose) closeMenu()
        })
      })
    }

    openButtonsListeners(arrayPopupsForListener)
    closeButtonsListener(
      asideButtonClose,
      modalCallButtonClose,
      modalFeedbackButtonClose
    )

    overlay.addEventListener('click', (event) => {
      if (event.target.classList.contains('overlay'))
        closePopup('and-close-menu-please')
    })
  }

  function addFormSubmitHandlers() {
    const forms = document.querySelectorAll('form')

    forms.forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault()
      })
    })
  }

  const addSectionListeners = (
    sectionName,
    sectionContainer,
    sectionButton,
    about = false
  ) => {
    const sectnContainer = document.querySelector(sectionContainer)
    const sectnButton = document.querySelector(sectionButton)
    const sectnButtonShowContentImg = sectnButton.firstElementChild
    const sectnButtonShowContentText = sectnButton.lastElementChild

    variables[`${sectionName}Container`] = sectnContainer
    variables[`${sectionName}Button`] = sectnButton

    const sectnContent = toggleConditionContent()

    sectnButton.addEventListener('click', () => {
      if (!sectnContent.activeContent) {
        sectnContent.showContent(
          sectnContainer,
          sectnButtonShowContentImg,
          sectnButtonShowContentText
        )
      } else {
        if (about) {
          sectnContent.hideContent(
            sectnContainer,
            sectnButtonShowContentImg,
            sectnButtonShowContentText,
            true
          )
        } else {
          sectnContent.hideContent(
            sectnContainer,
            sectnButtonShowContentImg,
            sectnButtonShowContentText
          )
        }
      }
    })
  }

  const toggleConditionContent = () => ({
    activeContent: false,
    showContent(container, imgButton, textButton) {
      container.classList.toggle('swiper--opened')

      imgButton.style.transform = 'scale(1, -1)'
      textButton.textContent = 'Скрыть все'

      this.activeContent = true
    },
    hideContent(container, imgButton, textButton, about) {
      container.classList.toggle('swiper--opened')

      if (about) {
        textButton.textContent = 'Читать далее'
      } else {
        textButton.textContent = 'Показать все'
      }

      imgButton.style.transform = ''

      this.activeContent = false
    }
  })

  const init = () => {
    overlay()
    swiper()
    addSectionListeners(
      'about',
      '.about__desc',
      '.about__button-show-content',
      true
    )
    addSectionListeners(
      'brands',
      '.brands__list',
      '.brands__button-show-content'
    )
    addSectionListeners(
      'periphery',
      '.periphery__list',
      '.periphery__button-show-content'
    )
    addFormSubmitHandlers()
  }

  init()
}

page()
