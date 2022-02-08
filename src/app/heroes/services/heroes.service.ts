import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Heroe } from '../interfaces/heroes.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  //Variable de entorno para correr el servidor
  private baseUrl: string = environment.baseUrl;
  //Variable para guardar el link de las peticiones (con variable de entorno)
  private apiUrl: string = `${this.baseUrl}/heroes`;

  constructor(private http: HttpClient) { }

  //Método para obtener los Heroes
  getHeroes(): Observable<Heroe[]> {
    return this.http.get<Heroe[]>(`${this.apiUrl}`);
  }

  //Método para obtener los héroes por ID
  getHeroeByID(id: string): Observable<Heroe> {
    return this.http.get<Heroe>(`${this.apiUrl}/${id}`);
  }

  //Método para obtener las sugerencias de búsqueda
  getSugerencias(term: string): Observable<Heroe[]> {
    return this.http.get<Heroe[]>(`${this.apiUrl}?q=${term}&_limit=6`);
  }

  //Método para agregar un nuevo heroe
  addHeroe(heroe: Heroe): Observable<Heroe> {
    return this.http.post<Heroe>(`${this.baseUrl}/heroes`, heroe);
  }

  //Método para actualizar un nuevo heroe
  updateHeroe(heroe: Heroe): Observable<Heroe> {
    return this.http.put<Heroe>(`${this.baseUrl}/heroes/${heroe.id}`, heroe);
  }

  //Método para borrar un heroe
  deleteHeroe(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/heroes/${id}`);
  }
}
