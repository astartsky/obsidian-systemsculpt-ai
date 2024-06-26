import { App, PluginSettingTab, Setting } from 'obsidian';
import SystemSculptPlugin from '../../main';
import { members } from './AboutData';

export class AboutModule {
  plugin: SystemSculptPlugin;

  constructor(plugin: SystemSculptPlugin) {
    this.plugin = plugin;
  }

  async load() {}

  settingsDisplay(containerEl: HTMLElement): void {
    new AboutSettingTab(this.plugin.app, this, containerEl).display();
  }
}

class AboutSettingTab extends PluginSettingTab {
  plugin: AboutModule;

  constructor(app: App, plugin: AboutModule, containerEl: HTMLElement) {
    super(app, plugin.plugin);
    this.plugin = plugin;
    this.containerEl = containerEl;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    const contentContainer = containerEl.createDiv('about-content-container');

    this.renderGeneral(contentContainer);
    this.renderHallOfFame(contentContainer);
  }

  private renderGeneral(containerEl: HTMLElement): void {
    const contentEl = containerEl.createDiv('about-content');

    const descEl = contentEl.createDiv('about-description');

    new Setting(descEl).setName("It's just me :D").setHeading();

    descEl.createEl('p', {
      text: 'By sponsoring or donating, you allow me to put more time into this and other Obsidian tools to benefit your productivity.',
    });

    const supportEl = contentEl.createDiv('about-support');

    // Replace Patreon link with a button
    const patreonButton = supportEl.createEl('button', {
      cls: 'patreon-sub-setting-button',
      text: 'Click here to become a Patreon member for only $10 bucks!',
    });

    // Add event listener to open the Patreon URL
    patreonButton.addEventListener('click', () => {
      window.open('https://www.patreon.com/SystemSculpt', '_blank');
    });

    const socialEl = contentEl.createDiv('about-social');
    const socialLinks = [
      {
        name: 'YouTube',
        url: 'https://www.youtube.com/@systemsculpt',
        icon: 'Y',
      },
      {
        name: 'X (Twitter)',
        url: 'https://x.com/systemsculpt',
        icon: 'X',
      },
      {
        name: 'GitHub',
        url: 'https://github.com/systemsculpt',
        icon: 'G',
      },
      {
        name: 'Buy me a coffee',
        url: 'https://www.buymeacoffee.com/SystemSculpt',
        icon: 'C',
      },
    ];

    const socialList = socialEl.createEl('ul', { cls: 'social-list' });
    socialLinks.forEach(link => {
      const listItem = socialList.createEl('li');
      const linkEl = listItem.createEl('a', {
        href: link.url,
        cls: 'social-link',
      });
      linkEl.createSpan({ cls: 'icon', text: link.icon });
      linkEl.createSpan({ text: link.name });
    });

    // Contact
    const contactEl = containerEl.createDiv('about-contact');
    contactEl.createEl('p', {
      text: 'For any inquiries, suggestions, or feedback, please reach out via email:',
    });
    contactEl.createEl('a', {
      href: 'mailto:systemsculpt@gmail.com',
      cls: 'contact-link',
      text: 'systemsculpt@gmail.com',
    });
  }

  private async renderHallOfFame(containerEl: HTMLElement): Promise<void> {
    const hallOfFameEl = containerEl.createDiv('about-hall-of-fame');

    // Use the combined members list
    const uniqueSupporters = members.reduce<{ name: string }[]>(
      (acc, current) => {
        if (!acc.some(item => item.name === current.name)) {
          acc.push(current);
        }
        return acc;
      },
      []
    );

    // Render combined and unique supporters section
    this.renderSupportersSection(
      hallOfFameEl,
      'SystemSculpt Supporters',
      uniqueSupporters
    );
  }

  private renderSupportersSection(
    containerEl: HTMLElement,
    title: string,
    supporters: { name: string }[]
  ): void {
    const sectionEl = containerEl.createDiv('supporters-section');
    const titleEl = sectionEl.createEl('h3', { text: title });
    titleEl.addClass('ss-h3');

    // Add description under the title
    const descriptionEl = sectionEl.createEl('p', {
      text: 'This section is dedicated to all Patreon members! Your support as a Patreon member allows me to dedicate more time to developing SystemSculpt productivity tools. Thank you!',
    });
    descriptionEl.addClass('supporters-description');

    const listEl = sectionEl.createEl('ul', { cls: 'supporter-list' });
    supporters.forEach(supporter => {
      const itemEl = listEl.createEl('li', { cls: 'supporter-item' });
      itemEl.createSpan({ text: supporter.name });
    });
  }
}
