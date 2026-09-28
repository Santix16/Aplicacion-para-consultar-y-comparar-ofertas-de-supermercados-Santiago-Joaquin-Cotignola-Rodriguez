import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { Offer } from '../../models/offer.model';
import { Store } from '../../models/store.model';
import { FavoritesService } from '../../services/favorites.service';

interface OfferWithDetails {
  offer: Offer;
  product: Product;
  store: Store;
}

@Component({
  selector: 'app-offer-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.css']
})
export class OfferCardComponent implements OnInit {
  @Input() offerDetails!: OfferWithDetails;
  // We no longer keep a cached copy of the favorite state; instead we
  // compute it on demand so the button is always in sync with the service.
  // That also ensures changes to the input or the underlying list are
  // reflected automatically.
  get favorite(): boolean {
    return this.offerDetails ? this.fav.isFavorite(this.offerDetails.offer.id) : false;
  }

  constructor(private readonly router: Router, private readonly fav: FavoritesService) {}

  ngOnInit() {
    // nothing to do here any more; computed property handles initial state
  }

  toggleFavorite(event: Event) {
    event.stopPropagation();
    const id = this.offerDetails.offer.id;
    if (this.favorite) {
      this.fav.remove(id);
    } else {
      this.fav.addWithDetails(id, this.offerDetails);
    }
  }

  onCardClick() {
    const offerId = this.offerDetails?.offer?.id;
    if (!offerId) {
      console.warn('OfferCardComponent: oferta sin id válido, no se puede abrir el detalle', this.offerDetails);
      return;
    }
    this.router.navigate(['/offer-detail', offerId]);
  }

  get discountPercentage(): number {
    return this.offerDetails.offer.discount;
  }

  get finalPrice(): number {
    return this.offerDetails.offer.finalPrice;
  }

  get originalPrice(): number {
    return this.offerDetails.offer.originalPrice;
  }
}
