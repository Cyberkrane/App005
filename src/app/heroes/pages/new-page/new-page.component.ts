import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../components/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  })

  public publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  constructor(private heroesService: HeroesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroById(id)),
      ).subscribe(hero => {
        if (!hero) return this.router.navigateByUrl('/');
        this.heroForm.reset(hero);
        console.log(hero);
        return;
      })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;
    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackBar(`${hero.superhero} actualizado!!!`);
        });
      return
    }
    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackBar(`${hero.superhero} agregado!!!`);
      });
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero id is required');
    console.log('eliminando heroe...',this.currentHero.id);
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed().subscribe(result => {
     if (!result) return;
     this.heroesService.deleteHeroById(this.currentHero.id)
     .subscribe(() => {
       this.showSnackBar('Heroe eliminado!!!');
     });
     this.router.navigate(['/heroes']);
    });
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Ok', {
      duration: 2500
    })
  }
}
