import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { FormBuilder } from '@angular/forms';
import { distinctUntilChanged, map, Observable, ReplaySubject, scan, startWith, switchMap, takeUntil, takeWhile } from 'rxjs';
import { TRANSITION_TEXT, TRANSITION_IMAGE_SCALE } from 'src/app/ui/animations/transitions/transitions.constants';
import { UiUtilsView } from 'src/app/ui/utils/views.utils';

@Component({
  selector: 'app-client-apps',
  templateUrl: './client-apps.component.html',
  styleUrls: ['./client-apps.component.scss'],
  animations: [
    TRANSITION_TEXT,
    TRANSITION_IMAGE_SCALE
  ]
})
export class ClientAppsComponent implements OnInit {
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

  _mClientApps = [

    {
     "id": "5131",
     "name": "OLX Group: Backend Developer Intern",
     "image": "assets/img/clients/olx.jfif",
     "link": "https://drive.google.com/file/d/1miDssGYRNx_fLrl-D8gV94mNOUnZAr9R/view",
     "tab": "Web",
     "color": "#FFFFFF"
   },


   {
     "id": "5132",
     "name": "Tech Table: Frontend Developer Intern",
     "image": "assets/img/clients/tech_table.jfif",
     "link": "https://drive.google.com/file/d/1l6MdolMIhB1mNBFddsuNYHuj6Gdj5n5A/view",
     "tab": "Web"
   },
   {
     "id": "5133",
     "name": "ONGC: Winter Trainee",
     "image": "assets/img/clients/ongc.png",
     "link": "https://drive.google.com/file/d/1OEoF62EsChXQ2u1Yyq_ZAMgUWjr7KVh3/view",
     "tab": "Web"
   }
  ];
}
