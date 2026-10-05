import "./index.css";
import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helper.js";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },

  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },

  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },

  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },

  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },

  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },

  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "284cbf68-fcf7-4ecb-abb7-24e22e292b02",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, info]) => {
    console.log(cards);
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    console.log(info);
    profileNameEl.textContent = info.name;
    profileDescriptionEl.textContent = info.about;
    profileAvatarEl.src = info.avatar;
  })
  .catch(console.error);

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const editProfileFormEl = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostFormEl = newPostModal.querySelector(".modal__form");

const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const cardCaptionInput = document.querySelector("#card-caption-input");
const cardImageInput = document.querySelector("#card-image-input");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

const cancelForm = document.querySelector("#cancel-btn");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const deleteModalCLoseBtn = deleteModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  function handleLike(id, isLiked) {
    api
      .changeLikeStatus(id, isLiked)
      .then(() => cardLikeBtnEl.classList.toggle("card__like-btn_active"))
      .catch(console.error);
  }

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const isLiked = cardLikeBtnEl.classList.contains("card__like-btn_active");
  cardLikeBtnEl.addEventListener("click", (evt) => {
    handleLike(data._id, isLiked);
  });

  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

editProfileFormEl.addEventListener("submit", handleProfileFormSubmit);

const activeHandlers = new Map();

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("modal_is-opened");

  const overlayHandler = function (evt) {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  };

  const escapeHandler = function (evt) {
    if (evt.key === "Escape") {
      closeModal(modal);
    }
  };

  activeHandlers.set(modal, { overlayHandler, escapeHandler });

  modal.addEventListener("mousedown", overlayHandler);
  document.addEventListener("keydown", escapeHandler);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("modal_is-opened");

  const handlers = activeHandlers.get(modal);

  if (handlers) {
    modal.removeEventListener("mousedown", handlers.overlayHandler);
    document.removeEventListener("keydown", handlers.escapeHandler);

    activeHandlers.delete(modal);
  }
}

editProfileBtn.addEventListener("click", function () {
  openModal(editProfileModal);
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileFormEl,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );
});

cancelForm.addEventListener("click", function () {
  closeModal(deleteModal);
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteModalCLoseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true);
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Delete";
    });
}

newPostFormEl.addEventListener("submit", handleAddCardSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true);
  const inputValues = {
    name: cardCaptionInput.value,
    link: cardImageInput.value,
  };

  api
    .createCards(inputValues)
    .then((newCard) => {
      const link = cardCaptionInput.value;
      const title = cardImageInput.value;
      const cardElement = getCardElement(newCard);
      cardsList.prepend(cardElement);

      console.log(link);
      console.log(title);

      newPostFormEl.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal(newPostModal);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

enableValidation(settings);
