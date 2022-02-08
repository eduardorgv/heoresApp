import { Component, OnInit } from '@angular/core';
import { switchMap } from "rxjs/operators";
import { ActivatedRoute, Router } from '@angular/router';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img {
      width: 100%;
      border-radius: 5px;
    }
  `
  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics' 
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics' 
    },
  ];

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: '',
  }

  constructor(private heroeService: HeroesService, 
              private activatedRoute: ActivatedRoute, 
              private router: Router, 
              private snackBar: MatSnackBar,
              private matDialog: MatDialog) { }

  ngOnInit(): void {
    if(!this.router.url.includes('editar')){
      return;
    }
    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.heroeService.getHeroeByID(id))
    )
    .subscribe( heroe => {
      this.heroe = heroe;
    });
  }

  guardar() {
    if(this.heroe.superhero.trim().length === 0){
    return;
    }

    if(this.heroe.id){
      //Actualiza el héroe
    this.heroeService.updateHeroe(this.heroe)
    .subscribe(heroe => {
      // console.log('Actualizando heroe', heroe);
      this.showSnackBar('Registro actualizado');
      this.router.navigate(['/heroes',heroe.id]);
    });
    } else {
      //Inserta un nueva héroe
      this.heroeService.addHeroe(this.heroe)
      .subscribe(heroe => {
        this.showSnackBar('Nuevo héroe insertado');
        this.router.navigate(['/heroes', heroe.id]);
      });
    }
  }

  //Método para eliminar un registro
  borrar() {
    const dialog = this.matDialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed()
    .subscribe(resp => {
      if(resp) {
        this.heroeService.deleteHeroe(this.heroe.id!)
        .subscribe(resp => {
          this.showSnackBar('Héroe eliminado');
          this.router.navigate(['/heroes']);
        });
      }
    });
  }

  //Muestra el Snackbar
  showSnackBar(message: string) {
    this.snackBar.open(message, 'ok!', {
      duration: 2500
    });
  }
}
