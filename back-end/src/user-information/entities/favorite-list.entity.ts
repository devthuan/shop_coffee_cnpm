import { Accounts } from "src/auth/entities/accounts.entity";
import { BaseEntity } from "src/common/base.entity";
import { Products } from "src/product/entities/products.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({name: "favoriteList"})
export class FavoriteList extends BaseEntity {
   
    @ManyToOne(() => Accounts, accounts => accounts.userInformation)
    account: Accounts;
    
   
    @ManyToOne(() => Products, products => products.favoriteList)
    products: Products;
    

}
