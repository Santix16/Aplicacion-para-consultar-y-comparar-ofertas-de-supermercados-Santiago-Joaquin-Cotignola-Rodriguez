import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-offer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.css']
})
export class OfferDetailComponent implements OnInit {
  offerId: string = '';
  offer: Offer | null = null;
  product: Product | null = null;
  store: Store | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.offerId = params['id'] || '';
      if (this.offerId) {
        this.loadOfferDetails(this.offerId);
      }
    });
  }

  loadOfferDetails(offerId: string) {
    this.loading = true;
    this.error = '';

    // Cargar la oferta
    this.apiService.getOfferById(offerId).subscribe({
      next: (offer: Offer) => {
        this.offer = offer;
        this.loadProductAndStore(offer);
      },
      error: (error: any) => {
        console.error('Error loading offer:', error);
        this.error = 'Oferta no encontrada';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadProductAndStore(offer: Offer) {
    // Cargar el producto
    this.apiService.getProductById(offer.productId).subscribe({
      next: (product: Product) => {
        this.product = product;
        // Cargar la tienda
        this.apiService.getStoreById(offer.storeId).subscribe({
          next: (store: Store) => {
            this.store = store;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (error: any) => {
            console.error('Error loading store:', error);
            this.error = 'No se pudo cargar la tienda';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.error = 'No se pudo cargar el producto';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    globalThis.history.back();
  }

  getSavings(): number {
    if (this.offer) {
      return Math.round((this.offer.originalPrice - this.offer.finalPrice) * 100) / 100;
    }
    return 0;
  }

  getDiscountPercentage(): number {
    if (this.offer) {
      return Math.round(((this.offer.originalPrice - this.offer.finalPrice) / this.offer.originalPrice) * 100);
    }
    return 0;
  }

  readonly weekDays = [
    { label: 'Lunes', key: 'monday' },
    { label: 'Martes', key: 'tuesday' },
    { label: 'Miércoles', key: 'wednesday' },
    { label: 'Jueves', key: 'thursday' },
    { label: 'Viernes', key: 'friday' },
    { label: 'Sábado', key: 'saturday' },
    { label: 'Domingo', key: 'sunday' }
  ];

  getOpeningHours(dayKey: string): string {
    const hours = (this.store?.openingHours as Record<string, string> | undefined)?.[dayKey];
    return hours ? hours : 'No disponible';
  }

  isOfferActive(): boolean {
    if (!this.offer) return false;
    const now = new Date();
    const startDate = new Date(this.offer.startDate);
    const endDate = new Date(this.offer.endDate);
    return now >= startDate && now <= endDate && this.offer.isActive;
  }
}
