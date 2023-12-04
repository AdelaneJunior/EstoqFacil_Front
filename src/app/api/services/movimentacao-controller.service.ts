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

import { MovimentacaoDto } from '../models/movimentacao-dto';
import { Pageable } from '../models/pageable';
import { RelatorioMovimentacaoDto } from '../models/relatorio-movimentacao-dto';
import { SearchField } from '../models/search-field';
import { SearchFieldValue } from '../models/search-field-value';

@Injectable({
  providedIn: 'root',
})
export class MovimentacaoControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation movimentacaoControllerObterPorId
   */
  static readonly MovimentacaoControllerObterPorIdPath = '/api/v1/movimentacao/{id}';

  /**
   * Obter os dados completos de uma entidiade pelo id informado!
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerObterPorId()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerObterPorId$Response(params: {
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerObterPorIdPath, 'get');
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
   * To access the full response (for headers, for example), `movimentacaoControllerObterPorId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerObterPorId(params: {
    id: number;
  },
  context?: HttpContext

): Observable<any> {

    return this.movimentacaoControllerObterPorId$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation movimentacaoControllerAlterar
   */
  static readonly MovimentacaoControllerAlterarPath = '/api/v1/movimentacao/{id}';

  /**
   * Método utilizado para altlerar os dados de uma entidiade
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerAlterar()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  movimentacaoControllerAlterar$Response(params: {
    id: number;
    body: MovimentacaoDto
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerAlterarPath, 'put');
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
   * To access the full response (for headers, for example), `movimentacaoControllerAlterar$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  movimentacaoControllerAlterar(params: {
    id: number;
    body: MovimentacaoDto
  },
  context?: HttpContext

): Observable<any> {

    return this.movimentacaoControllerAlterar$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation movimentacaoControllerRemover
   */
  static readonly MovimentacaoControllerRemoverPath = '/api/v1/movimentacao/{id}';

  /**
   * Método utilizado para remover uma entidiade pela id informado
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerRemover()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerRemover$Response(params: {
    id: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerRemoverPath, 'delete');
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
   * To access the full response (for headers, for example), `movimentacaoControllerRemover$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerRemover(params: {
    id: number;
  },
  context?: HttpContext

): Observable<any> {

    return this.movimentacaoControllerRemover$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation movimentacaoControllerListAll
   */
  static readonly MovimentacaoControllerListAllPath = '/api/v1/movimentacao';

  /**
   * Listagem Geral
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerListAll()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerListAll$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerListAllPath, 'get');
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
   * To access the full response (for headers, for example), `movimentacaoControllerListAll$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerListAll(params?: {
  },
  context?: HttpContext

): Observable<any> {

    return this.movimentacaoControllerListAll$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation movimentacaoControllerIncluir
   */
  static readonly MovimentacaoControllerIncluirPath = '/api/v1/movimentacao';

  /**
   * Método utilizado para realizar a inclusão de um entidade
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerIncluir()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  movimentacaoControllerIncluir$Response(params: {
    body: MovimentacaoDto
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerIncluirPath, 'post');
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
   * To access the full response (for headers, for example), `movimentacaoControllerIncluir$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  movimentacaoControllerIncluir(params: {
    body: MovimentacaoDto
  },
  context?: HttpContext

): Observable<any> {

    return this.movimentacaoControllerIncluir$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation movimentacaoControllerSearchFieldsList
   */
  static readonly MovimentacaoControllerSearchFieldsListPath = '/api/v1/movimentacao/search-fields';

  /**
   * Listagem dos campos de busca
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerSearchFieldsList()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerSearchFieldsList$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<SearchField>>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerSearchFieldsListPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<SearchField>>;
      })
    );
  }

  /**
   * Listagem dos campos de busca
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `movimentacaoControllerSearchFieldsList$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerSearchFieldsList(params?: {
  },
  context?: HttpContext

): Observable<Array<SearchField>> {

    return this.movimentacaoControllerSearchFieldsList$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<SearchField>>) => r.body as Array<SearchField>)
    );
  }

  /**
   * Path part for operation movimentacaoControllerSearchFieldsAction
   */
  static readonly MovimentacaoControllerSearchFieldsActionPath = '/api/v1/movimentacao/search-fields';

  /**
   * Realiza a busca pelos valores dos campos informados
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerSearchFieldsAction()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  movimentacaoControllerSearchFieldsAction$Response(params: {
    body: Array<SearchFieldValue>
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerSearchFieldsActionPath, 'post');
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
   * Realiza a busca pelos valores dos campos informados
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `movimentacaoControllerSearchFieldsAction$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  movimentacaoControllerSearchFieldsAction(params: {
    body: Array<SearchFieldValue>
  },
  context?: HttpContext

): Observable<any> {

    return this.movimentacaoControllerSearchFieldsAction$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation movimentacaoControllerSearchFieldsActionPage
   */
  static readonly MovimentacaoControllerSearchFieldsActionPagePath = '/api/v1/movimentacao/search-fields/page';

  /**
   * Realiza a busca pelos valores dos campos informados
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerSearchFieldsActionPage()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  movimentacaoControllerSearchFieldsActionPage$Response(params: {
    body: {
'searchFieldValues'?: Array<SearchFieldValue>;
'page'?: Pageable;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerSearchFieldsActionPagePath, 'post');
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
   * Realiza a busca pelos valores dos campos informados
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `movimentacaoControllerSearchFieldsActionPage$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  movimentacaoControllerSearchFieldsActionPage(params: {
    body: {
'searchFieldValues'?: Array<SearchFieldValue>;
'page'?: Pageable;
}
  },
  context?: HttpContext

): Observable<any> {

    return this.movimentacaoControllerSearchFieldsActionPage$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation movimentacaoControllerListAllPage
   */
  static readonly MovimentacaoControllerListAllPagePath = '/api/v1/movimentacao/page';

  /**
   * Listagem Geral paginada
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerListAllPage()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerListAllPage$Response(params: {
    page: Pageable;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerListAllPagePath, 'get');
    if (params) {
      rb.query('page', params.page, {});
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
   * Listagem Geral paginada
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `movimentacaoControllerListAllPage$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerListAllPage(params: {
    page: Pageable;
  },
  context?: HttpContext

): Observable<any> {

    return this.movimentacaoControllerListAllPage$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation movimentacaoControllerMapearRelatorio
   */
  static readonly MovimentacaoControllerMapearRelatorioPath = '/api/v1/movimentacao/mapeamento';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerMapearRelatorio()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerMapearRelatorio$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<RelatorioMovimentacaoDto>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerMapearRelatorioPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: '*/*',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RelatorioMovimentacaoDto>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `movimentacaoControllerMapearRelatorio$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerMapearRelatorio(params?: {
  },
  context?: HttpContext

): Observable<RelatorioMovimentacaoDto> {

    return this.movimentacaoControllerMapearRelatorio$Response(params,context).pipe(
      map((r: StrictHttpResponse<RelatorioMovimentacaoDto>) => r.body as RelatorioMovimentacaoDto)
    );
  }

  /**
   * Path part for operation movimentacaoControllerTodasMovimentacoesDeProdutoPorCodigo
   */
  static readonly MovimentacaoControllerTodasMovimentacoesDeProdutoPorCodigoPath = '/api/v1/movimentacao/geral{codigoProduto}';

  /**
   * Listagem de movimentações de um produto
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerTodasMovimentacoesDeProdutoPorCodigo()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerTodasMovimentacoesDeProdutoPorCodigo$Response(params: {
    codigoProduto: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerTodasMovimentacoesDeProdutoPorCodigoPath, 'get');
    if (params) {
      rb.path('codigoProduto', params.codigoProduto, {});
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
   * Listagem de movimentações de um produto
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `movimentacaoControllerTodasMovimentacoesDeProdutoPorCodigo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerTodasMovimentacoesDeProdutoPorCodigo(params: {
    codigoProduto: number;
  },
  context?: HttpContext

): Observable<any> {

    return this.movimentacaoControllerTodasMovimentacoesDeProdutoPorCodigo$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation movimentacaoControllerTodasMovimentacoesProdutosEntradaSaida
   */
  static readonly MovimentacaoControllerTodasMovimentacoesProdutosEntradaSaidaPath = '/api/v1/movimentacao/geral';

  /**
   * Realiza busca paginada de acordo com o tamanho da pagina e a pagina
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerTodasMovimentacoesProdutosEntradaSaida()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerTodasMovimentacoesProdutosEntradaSaida$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerTodasMovimentacoesProdutosEntradaSaidaPath, 'get');
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
   * Realiza busca paginada de acordo com o tamanho da pagina e a pagina
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `movimentacaoControllerTodasMovimentacoesProdutosEntradaSaida$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerTodasMovimentacoesProdutosEntradaSaida(params?: {
  },
  context?: HttpContext

): Observable<any> {

    return this.movimentacaoControllerTodasMovimentacoesProdutosEntradaSaida$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

  /**
   * Path part for operation movimentacaoControllerListMovimentacoesPorProdutoWithPagination
   */
  static readonly MovimentacaoControllerListMovimentacoesPorProdutoWithPaginationPath = '/api/v1/movimentacao/geral/pagination/{codProduto}/{offset}/{pageSize}';

  /**
   * Realiza busca paginada de acordo com o tamanho da pagina e a pagina
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `movimentacaoControllerListMovimentacoesPorProdutoWithPagination()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerListMovimentacoesPorProdutoWithPagination$Response(params: {
    codProduto: number;
    offset: number;
    pageSize: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<any>> {

    const rb = new RequestBuilder(this.rootUrl, MovimentacaoControllerService.MovimentacaoControllerListMovimentacoesPorProdutoWithPaginationPath, 'get');
    if (params) {
      rb.path('codProduto', params.codProduto, {});
      rb.path('offset', params.offset, {});
      rb.path('pageSize', params.pageSize, {});
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
   * Realiza busca paginada de acordo com o tamanho da pagina e a pagina
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `movimentacaoControllerListMovimentacoesPorProdutoWithPagination$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  movimentacaoControllerListMovimentacoesPorProdutoWithPagination(params: {
    codProduto: number;
    offset: number;
    pageSize: number;
  },
  context?: HttpContext

): Observable<any> {

    return this.movimentacaoControllerListMovimentacoesPorProdutoWithPagination$Response(params,context).pipe(
      map((r: StrictHttpResponse<any>) => r.body as any)
    );
  }

}
