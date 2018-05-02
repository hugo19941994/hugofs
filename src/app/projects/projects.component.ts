import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation
} from "@angular/core";

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: "projects",
  styleUrls: ["./projects.component.css"],
  templateUrl: "./projects.component.html"
})
export class ProjectsComponent {
  private projects = [] as Array<Project>;

  constructor() {
    const spaceInvaders = new Project(
      "Space Invaders",
      "Emulator",
      [
        "For my second emulator in 2013 I decided to implement the Intel 8080 CPU, which was used by Space Invaders",
        "OpenGL is used to draw the graphics",
        "For now it only works in macOS"
      ],
      "https://github.com/hugo19941994/SpaceInvaders-Emu",
      undefined,
      undefined
    );
    this.projects.push(spaceInvaders);

    const chip8 = new Project(
      "CHIP-8",
      "Emulator",
      [
        "A simple but usable CHIP-8 emulator",
        "SDL is used to draw the graphics",
        "Compiles in Windows and Linux with GTK 3"
      ],
      "https://github.com/hugo19941994/CHIP8-Emu",
      undefined,
      undefined
    );
    this.projects.push(chip8);

    const vpn = new Project(
      "ovpn.io",
      "VPN service",
      [
        "Some classmates needed a VPN to bypass a firewall, so I decided to build a service for them."
      ],
      undefined,
      "https://vpn.hugofs.com",
      undefined
    );
    this.projects.push(vpn);

    const cvParser = new Project(
      "CV-Parser",
      "University project",
      [
        "Third year university assignment",
        "Website platform to manage and search CV",
        "Written in python with NLTK, IBM Alchemy and regex rules to parse and extract useful information from CVs",
        "The search engine is powered by Elasticsearch",
        "Website built with Spring in Java"
      ],
      "https://github.com/hugo19941994/CV-Parser",
      "https://cv-parser.hugofs.com",
      undefined
    );
    this.projects.push(cvParser);

    const infraccoche = new Project(
      "InfracCoche",
      "University research",
      [
        "Android app to detect infractions while driving",
        "Uses OpenCV and k-NN to recognize traffic signs"
      ],
      "https://github.com/hugo19941994/InfracCoche",
      undefined,
      "https://github.com/hugo19941994/InfracCoche/releases"
    );
    this.projects.push(infraccoche);

    const viajeFacil = new Project(
      "Viaje Fácil",
      "University project",
      ["First year university assignment", "Software to manage flights"],
      "https://github.com/hugo19941994/ViajeFacil",
      "https://hugo19941994.github.io/ViajeFacil/",
      "https://github.com/hugo19941994/ViajeFacil/releases"
    );
    this.projects.push(viajeFacil);
  }
}

class Project {
  constructor(
    public header: string,
    public subheader: string,
    public description: Array<string>,
    public repo: string,
    public website: string,
    public releases: string
  ) {}
}
