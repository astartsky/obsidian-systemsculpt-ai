import { App, Modal, Notice } from 'obsidian';

export class GeneratingTitleModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen(): void {
    let { contentEl } = this;

    contentEl.addClass('modal-content-centered');

    const header = contentEl.createEl('h2', { text: 'Generating Title...' });
    header.addClass('modal-header');

    const spinner = this.contentEl.createDiv('spinner');
    spinner.createDiv('double-bounce1');
    spinner.createDiv('double-bounce2');
  }

  onClose(): void {
    let { contentEl } = this;
    contentEl.empty();
  }
}

export class LoadingModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen(): void {
    let { contentEl } = this;

    contentEl.addClass('modal-content-centered');

    const header = contentEl.createEl('h2', { text: 'Generating Task...' });
    header.addClass('modal-header');

    const spinner = this.contentEl.createDiv('spinner');
    spinner.createDiv('double-bounce1');
    spinner.createDiv('double-bounce2');
  }

  onClose(): void {
    let { contentEl } = this;
    contentEl.empty();
  }
}

export function showCustomNotice(
  message: string,
  duration: number = 5000
): Notice {
  const notice = new Notice('', duration);
  const noticeContentEl = notice.noticeEl.createDiv('custom-notice-content');
  const messageDiv = noticeContentEl.createDiv('custom-notice-message');
  messageDiv.textContent = message; // Correct way to set text content
  notice.noticeEl.addClass('custom-notice');
  notice.noticeEl.addEventListener('click', () => notice.hide());

  // Ensure the notice is positioned in the bottom right corner
  const noticeContainer = document.body.querySelector('.notice-container');
  if (!noticeContainer) {
    const createdContainer = document.createElement('div');
    createdContainer.className = 'notice-container';
    document.body.appendChild(createdContainer);
    createdContainer.appendChild(notice.noticeEl);
  } else {
    noticeContainer.appendChild(notice.noticeEl);
  }

  notice.noticeEl.addClass('custom-notice-position');

  // Add animation class for generating notice
  if (message.startsWith('Generating')) {
    notice.noticeEl.addClass('generating-notice');
  }

  return notice;
}
export function hideCustomNotice(notice: Notice): void {
  notice.hide();
}
