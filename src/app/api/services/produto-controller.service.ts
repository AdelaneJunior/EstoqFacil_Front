/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ProdutoDto } from '../models/produto-dto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation produtoControllerObterPorId
   */
  static readonly ProdutoControllerObterPorIdPath = '/api/v1/produto/{id}';

  /**
   * Obter os dados completos de uma entidiade pelo id informado!
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `produtoControllerObterPorId()` instead.
   *
   * This method doesn't expect any request body.
   */
  produtoControllerObterPorId$Response(params: {
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, ProdutoControllerService.ProdutoControllerObterPorIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<any>;
      })
    );
  }

  /**
   * Obter os dados completos de uma entidiade pelo id informado!
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `produtoControllerObterPorId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  produtoControllerObterPorId(params: {
    id: number;
  },
  context?: HttpContext

): Observable<any> {

    return this.produtoControllerObterPorId$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation produtoControllerAlterar
   */
  static readonly ProdutoControllerAlterarPath = '/api/v1/produto/{id}';

  /**
   * Método utilizado para altlerar os dados de uma entidiade
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `produtoControllerAlterar()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  produtoControllerAlterar$Response(params: {
    id: number;
    body: ProdutoDto
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, ProdutoControllerService.ProdutoControllerAlterarPath, 'put');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<any>;
      })
    );
  }

  /**
   * Método utilizado para altlerar os dados de uma entidiade
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `produtoControllerAlterar$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  produtoControllerAlterar(params: {
    id: number;
    body: ProdutoDto
  },
  context?: HttpContext

): Observable<any> {

    return this.produtoControllerAlterar$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation produtoControllerRemover
   */
  static readonly ProdutoControllerRemoverPath = '/api/v1/produto/{id}';

  /**
   * Método utilizado para remover uma entidiade pela id informado
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `produtoControllerRemover()` instead.
   *
   * This method doesn't expect any request body.
   */
  produtoControllerRemover$Response(params: {
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, ProdutoControllerService.ProdutoControllerRemoverPath, 'delete');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<any>;
      })
    );
  }

  /**
   * Método utilizado para remover uma entidiade pela id informado
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `produtoControllerRemover$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  produtoControllerRemover(params: {
    id: number;
  },
  context?: HttpContext

): Observable<any> {

    return this.produtoControllerRemover$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation produtoControllerListAll
   */
  static readonly ProdutoControllerListAllPath = '/api/v1/produto';

  /**
   * Listagem Geral
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `produtoControllerListAll()` instead.
   *
   * This method doesn't expect any request body.
   */
  produtoControllerListAll$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, ProdutoControllerService.ProdutoControllerListAllPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<any>;
      })
    );
  }

  /**
   * Listagem Geral
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `produtoControllerListAll$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  produtoControllerListAll(params?: {
  },
  context?: HttpContext

): Observable<any> {

    return this.produtoControllerListAll$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation produtoControllerIncluir
   */
  static readonly ProdutoControllerIncluirPath = '/api/v1/produto';

  /**
   * Método utilizado para realizar a inclusão de um entidade
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `produtoControllerIncluir()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  produtoControllerIncluir$Response(params: {
    body: ProdutoDto
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, ProdutoControllerService.ProdutoControllerIncluirPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<any>;
      })
    );
  }

  /**
   * Método utilizado para realizar a inclusão de um entidade
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `produtoControllerIncluir$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  produtoControllerIncluir(params: {
    body: ProdutoDto
  },
  context?: HttpContext

): Observable<any> {

    return this.produtoControllerIncluir$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

}
