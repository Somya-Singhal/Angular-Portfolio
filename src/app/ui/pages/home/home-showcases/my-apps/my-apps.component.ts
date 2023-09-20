import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder } from '@angular/forms';
import { ReplaySubject, takeUntil, startWith, map, scan, distinctUntilChanged, takeWhile, switchMap, Observable } from 'rxjs';
import { AppType } from 'src/app/types/apps_type';
import { TRANSITION_IMAGE_SCALE, TRANSITION_TEXT } from 'src/app/ui/animations/transitions/transitions.constants';
import { UiUtilsView } from 'src/app/ui/utils/views.utils';

@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrls: ['./my-apps.component.scss'],
  animations: [
    TRANSITION_TEXT,
    TRANSITION_IMAGE_SCALE
  ]
})
export class MyAppsComponent implements OnInit {


  _mApps : AppType[] = [

    {
     "id": "5131",
     "name": "Sahayak Bot: Autonomous Robot",
     "image": "assets/img/apps/sahayak robot.jfif",
     "link": "https://drive.google.com/drive/folders/1Hypbx9KgtKB2Um-rOIQiQTCszwhFV0Q2",
     "tab": "Robotics",
     "caption": "In Robotics -",
     "isFull": false,
     "primary":"#3FD67D",
     "background":"#E1E1E1"
   },
   {
     "id": "5132",
     "name": "Online Code Editor: A Productive IDE",
     "image": "assets/img/apps/code_editor.png",
     "link": "https://somya-singhal.github.io/online-editor/",
     "tab": "Web",
     "isFull": false,
     "caption": "In React -",
     "background":"#F5E7B4"
   },
   {
     "id": "5133",
     "name": "Somya's Mansion: Personal Portfolio",
     "image": "assets/img/apps/portfolio.jfif",
     "link": "https://somya-singhal.github.io/Somya-Mansion/",
     "tab": "Web",
     "caption": "In Three.js -",
     "isFull": true,
     "background":"#3CE79F"
   }
  ];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  mOnceAnimated = false

  /* ********************************************************************************************
    *                anims
    */
  _mTriggerAnim?= 'false'



  _mThreshold = 0.4


  @ViewChild('animRefView') vAnimRefView?: ElementRef<HTMLElement>;

  constructor(public el: ElementRef,
    private _ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public mediaObserver: MediaObserver,
    private scroll: ScrollDispatcher, private viewPortRuler: ViewportRuler,
    private formBuilder: FormBuilder) {



  }

  ngOnInit(): void {
  }



  ngAfterViewInit(): void {
    this.setupAnimation();
  }

  ngOnDestroy(): void {

    this.destroyed$.next(true)
    this.destroyed$.complete()
  }




  /* ***************************************************************************
   *                                  other parts
   */


  public setupAnimation() {
    if (!this.vAnimRefView) return;

    // console.info("home products setupAnimation: " )
    this.scroll.ancestorScrolled(this.vAnimRefView, 100).pipe(
      // Makes sure to dispose on destroy
      takeUntil(this.destroyed$),
      startWith(0),
      map(() => {
        if (this.vAnimRefView != null) {
          var visibility = UiUtilsView.getVisibility(this.vAnimRefView, this.viewPortRuler)
          // console.log("product app-item UiUtilsView visibility: ", visibility)
          return visibility;
        }
        return 0;

      }),
      scan<number, boolean>((acc: number | boolean, val: number) => (val >= this._mThreshold || (acc ? val > 0 : false))),
      // Distincts the resulting triggers 
      distinctUntilChanged(),
      // Stop taking the first on trigger when aosOnce is set
      takeWhile(trigger => {
        // console.info("app-item  !trigger || !this.mOnceAnimated",
        //   !trigger || !this.mOnceAnimated)

        return !trigger || !this.mOnceAnimated
      }, true),
      switchMap(trigger => new Observable<number | boolean>(observer => this._ngZone.run(() => observer.next(trigger))))
    ).subscribe(val => {


      // console.log("home-item setupAnimation ancestorScrolled: ", val)

      if (this.mOnceAnimated) {
        return;
      }

      if (val) {
        // console.log("HomeProductsComponent setupAnimation setupAnimation ancestorScrolled: ", val)

        this.mOnceAnimated = true
        this._mTriggerAnim = 'true'
        this.cdr.detectChanges()
      }
      // if (this.vImageArea != null) {
      //   var visibility = UiUtilsView.getVisibility(this.vImageArea, this.viewPortRuler)
      //   console.log("UiUtilsView visibility: ", visibility)
      // }
    }

    )
  }
}
