import {animate, style, transition, trigger} from '@angular/animations';

export const MenuAnimations = trigger('menuSlider', [
  transition(':enter', [
    style({ transform: 'translateX(-20%)' }),
    animate('{{ period }}', style({ transform: 'translateX(0)' }))
  ])
]);
