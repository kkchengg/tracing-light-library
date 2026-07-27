document.addEventListener("DOMContentLoaded", async () => {
  await loadSharedLayout();
  setCurrentNavigation();
  setupMobileMenu();
  setupNewsTabs();
  setupReservationForm();
  updateFooterYear();
});

async function loadSharedLayout() {
  await Promise.all([
    loadHtmlFragment("header-placeholder", "header.html"),
    loadHtmlFragment("footer-placeholder", "footer.html")
  ]);
}

async function loadHtmlFragment(placeholderId, filePath) {
  const placeholder = document.getElementById(placeholderId);

  if (!placeholder) {
    return;
  }

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`無法載入 ${filePath}`);
    }

    placeholder.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
    placeholder.innerHTML = `
      <div class="layout-load-error" role="alert">
        網站元件暫時未能載入，請稍後再試。
      </div>
    `;
  }
}

function setCurrentNavigation() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navigationLinks = document.querySelectorAll(".main-navigation a");

  navigationLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function setupMobileMenu() {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");

  if (!menuButton || !navigation) {
    return;
  }

  const closeMenu = () => {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "開啟網站選單");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "關閉網站選單" : "開啟網站選單"
    );
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
      closeMenu();
    }
  });
}

function setupNewsTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  if (!tabButtons.length || !tabPanels.length) {
    return;
  }

  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      activateTab(button);
    });

    button.addEventListener("keydown", (event) => {
      const currentIndex = Array.from(tabButtons).indexOf(button);
      let nextIndex = null;

      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabButtons.length;
      }

      if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      }

      if (event.key === "Home") {
        nextIndex = 0;
      }

      if (event.key === "End") {
        nextIndex = tabButtons.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        tabButtons[nextIndex].focus();
        activateTab(tabButtons[nextIndex]);
      }
    });

    if (index === 0) {
      button.setAttribute("tabindex", "0");
    }
  });
}

function activateTab(selectedButton) {
  const targetPanelId = selectedButton.getAttribute("aria-controls");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((button) => {
    const isSelected = button === selectedButton;

    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-selected", String(isSelected));
    button.setAttribute("tabindex", isSelected ? "0" : "-1");
  });

  tabPanels.forEach((panel) => {
    const isTargetPanel = panel.id === targetPanelId;

    panel.classList.toggle("is-active", isTargetPanel);
    panel.hidden = !isTargetPanel;
  });
}

function setupReservationForm() {
  const form = document.getElementById("reservation-form");
  const successMessage = document.getElementById("form-success-message");

  if (!form || !successMessage) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.hidden = true;
    successMessage.hidden = false;
    successMessage.setAttribute("tabindex", "-1");
    successMessage.focus();
  });
}

function updateFooterYear() {
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}