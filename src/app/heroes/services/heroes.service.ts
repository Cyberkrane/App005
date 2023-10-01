import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from 'src/environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

    private basUrl: string = environments.baseUrl;
    
    constructor(private http: HttpClient) { }

    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>(`${this.basUrl}/heroes`);
    }

    getSugesstions(query: string): Observable<Hero[]> {
        return this.http.get<Hero[]>(`${this.basUrl}/heroes?q=${query}&_limit=10`);
    }

    // CRUD
    // create
    addHero(hero: Hero): Observable<Hero> {
        return this.http.post<Hero>(`${this.basUrl}/heroes`, hero);
    }
    // read
    getHeroById(id: string): Observable<Hero | undefined> {
        return this.http.get<Hero>(`${this.basUrl}/heroes/${id}`)
                .pipe(
                    catchError(error => of(undefined))
                );
    }
    // update
    updateHero(hero: Hero ): Observable<Hero>{
        if(!hero.id) throw Error('Hero id is required');
        return this.http.patch<Hero>(`${this.basUrl}/heroes/${hero.id}`,hero);
    }
    // delete
    deleteHeroById(id: string): Observable<boolean> {
        return this.http.delete(`${this.basUrl}/heroes/${id}`)
        .pipe(
            catchError(error => of(false)),
            map(resp => true)
        );
    }

    
}