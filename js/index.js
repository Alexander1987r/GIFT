//настойки API адресса
const API_URL="https://acute-faithful-snowplow.glitch.me";



//второй swiper
const swiperThumb= new Swiper('.gift__swiper_thumb',{
  spaceBetween:16,
  slidesPerView:6,
  freeMode:true,
  watchSlidesProgress:true,
});

//первый swiper
const swiperMain= new Swiper('.gift__swiper_card',{
    spaceBetween:16,
    thumbs:{
      swiper:swiperThumb,
    }
});

//найдем поля телефонов 
const phoneInputs=document.querySelectorAll('.form__field_phone');
//найдем форму
const form=document.querySelector('.form');
//кнопку
const submitButton=form.querySelector('.form__button');
//получим скрытый input для картинки
const cardInput=form.querySelector('.form__card');

//функция находящая активный елемент swiper(карусели) и ее картинку
const updateCardInput=()=>{
  
  //находим активный слайд
  const activeSlide=document.querySelector('.gift__swiper_card .swiper-slide-active');

  //находим картинку активного слайда(дата-атрибут)
  const cardData=activeSlide.querySelector('.gift__card-image').dataset.card;
  cardInput.value=cardData;
  console.log(cardData);
}
updateCardInput();
//обратимся к методу в swiper
swiperMain.on('slideChangeTransitionEnd',updateCardInput);

//обьект для валидации
const phoneValidateOption={
  format:{
    pattern:"\\+7\\(\\d{3}\\)\\d{3}-\\d{2}-\\d{2}",
    message:'Номер телефона должен соответствовать формату:"+7(XXX)XXX-XX-XX"'
  }
};

for(let i=0;i<phoneInputs.length;i++){
  const element=phoneInputs[i];
    IMask(element,{
    mask:"+{7}(000)000-00-00",
  });
}

//функция активирующая кнопку отправк при вводе текста
const updateSubmitButton=()=>{
  let isFormField=true;
  for(const field of form.elements){
    if(field.classList.contains("form__field")){
       if(!field.value){
        isFormField=false;
        break;
       }
    }
  }
  submitButton.disabled=!isFormField;
}

form.addEventListener('input',updateSubmitButton);

form.addEventListener('submit',async (evt)=>{
  evt.preventDefault();
  const errors=validate(form,{
    sender_phone:phoneValidateOption,
    receiver_phone:phoneValidateOption
  });
  if(errors){
    for(const key in errors){
      const errorString=errors[key];
      alert(errorString);
    }
    return;
  };
  //создание обьекта FormData
  const formData=new FormData(form);
  const data=Object.fromEntries(formData);
  
  //создаем запрос при помощи конструкции  try {} catch {}
  try {
    //получение запроса
    const response= await fetch(`${API_URL}/api/gift`,{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    });
    //преобразование запроса
    const result=await response.json();
    if(response.ok){
     prompt('Открытка успешно сохранена.Доступна по адрессу:',
     `${location.origin}/card.html?id=${result.id}`); 
     form.reset();
    } else {
      alert(` Ошибка при отправки: ${result.message}`);
    }
  } catch (error){
     console.error(` Ошибка при отправки: ${error}`);
     alert(`Произошла ошибка!Попробуйте снова`);
  }
});