import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';



export const routes: Routes = [
    {path:'',component:HomeComponent},
    { path: 'products', component:ProductListComponent,   },
    {path:'signup', component:SignupComponent},
    {path:'login', component:LoginComponent},
    {path:'cart',component:CartComponent}

    

];
