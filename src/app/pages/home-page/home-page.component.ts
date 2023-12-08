import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  images: string[] = [
    "https://images.kabum.com.br/produtos/fotos/sync_mirakl/444837/Notebook-Razer-Blade-16-Intel-13-Gera-o-I9-13950hx-32GB-de-RAM-SSD-2TB-NVMe-Tela-16-Polegadas-UHD-RTX-4090-da-NVIDIA-Windows_1690331919_gg.jpg",
    "https://www.adrenaline.com.br/wp-content/plugins/seox-image-magick/imagick_convert.php?width=1000&height=595&format=webp&quality=91&imagick=uploads.adrenaline.com.br/2023/06/m161.jpg",
    "https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2023/09/iphones-novos.jpg?w=1220&h=674&crop=1",
  ];
  currentIndex: number = 0;
  dynamicText: string[] = [
    'Estoque é fácil',
    'Fácil é EstoqFácil',
    'Gerenciamento de estoque mais simples',
    'E muito mais (e só isso)'
  ]
  interval: any;
  backgroundImageUrl: string = this.images[this.currentIndex];

  ngOnInit() {
    this.startSlideshow();
  }

  startSlideshow() {
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.backgroundImageUrl = this.images[this.currentIndex];
    }, 3000); // Altere o valor para o intervalo desejado em milissegundos
  }

  pauseSlideshow() {
    clearInterval(this.interval);
    this.startSlideshow();
  }
}
