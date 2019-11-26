import {Component, ElementRef, Input, OnDestroy, OnInit, Self, ViewChild} from '@angular/core';
import {MenuAnimations} from './MenuAnimations';

@Component({
  selector: 'app-menu-background',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [MenuAnimations]
})
export class MenuComponent implements OnInit, OnDestroy {
  @ViewChild('menuCanvas', {static: true}) canvasRef: ElementRef;
  @Input()
  public width = 200;
  @Input()
  public duration = 800;
  @Input()
  public waveWidth = 20;
  @Input()
  public contentMargin = 20;

  private ctx: CanvasRenderingContext2D;
  private color = '#757575';
  private run = true;

  constructor(
    @Self() private element: ElementRef
  ) {
  }

  ngOnInit() {
    window.addEventListener('resize', () => this.resizeCanvas(0), false);
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    window.requestAnimationFrame(() => this.resizeCanvas(Date.now()));
  }

  private resizeCanvas(startDate: number): void {
    if (this.run) {
      const [width, height] = this.updateCanvasSize();
      const timeDiff = Date.now() - startDate;
      if (timeDiff < this.duration / 2) {
        this.drawStart(width, height, timeDiff, startDate);
      } else if (timeDiff < this.duration) {
        this.drawDebounce(width, height, timeDiff, startDate);
      } else {
        this.drawComplete(width, height);
      }
    }
  }

  private clear(): void {
    this.run = false;
    const [width, height] = this.updateCanvasSize();
    this.ctx.clearRect(0, 0, width, height);
  }

  private updateCanvasSize(): [number, number] {
    const width = this.canvasRef.nativeElement.width = this.element.nativeElement.offsetWidth;
    const height = this.canvasRef.nativeElement.height = this.element.nativeElement.offsetHeight;
    return [width, height];
  }

  private drawStart(width, height, timeDiff: number, startDate: number): void {
    const percentTimePassed = (timeDiff / this.duration) * 2;
    const shift = percentTimePassed * this.width;
    const spread = percentTimePassed > 0.5 ? percentTimePassed : 0.5;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(shift * spread, 0);
    this.ctx.quadraticCurveTo(shift, height / 2, shift * spread, height);
    this.ctx.lineTo(0, height);
    this.ctx.clip('evenodd');

    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    window.requestAnimationFrame(() => this.resizeCanvas(startDate));
  }

  private drawDebounce(width: number, height: number, timeDiff: number, startDate: number): void {
    const stageCount = 6;
    const halfTime = this.duration / 2;
    const stageTime = halfTime / stageCount;
    const timePassed = timeDiff - halfTime;
    const currentStage = Math.floor(timePassed / stageTime);
    const timePassedInCurrentStage = timePassed - (stageTime * currentStage);
    const speed = (this.waveWidth * stageCount) / halfTime;

    let shift = this.width;
    if (currentStage === 0 || currentStage === 4) {
      shift += speed * timePassedInCurrentStage;
    } else if (currentStage === 1 || currentStage === 5) {
      shift += this.waveWidth - speed * timePassedInCurrentStage;
    } else if (currentStage === 2) {
      shift -= speed * timePassedInCurrentStage;
    } else if (currentStage === 3) {
      shift += speed * timePassedInCurrentStage - this.waveWidth;
    }

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(shift, 0);
    this.ctx.quadraticCurveTo(this.width, height / 2, shift, height);
    this.ctx.lineTo(0, height);
    this.ctx.clip('evenodd');

    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    window.requestAnimationFrame(() => this.resizeCanvas(startDate));
  }

  private drawComplete(width: number, height: number): void {
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.width, 0);
    this.ctx.lineTo(this.width, height);
    this.ctx.lineTo(0, height);
    this.ctx.clip('evenodd');

    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  ngOnDestroy(): void {
    this.clear();
  }
}
