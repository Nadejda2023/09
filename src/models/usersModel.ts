

    export type PaginatedUser<T> = {
        pagesCount: number,
        page: number,
        pageSize: number,
        totalCount: number,
        items: T[],
      }

      export type UsersModelSw =
      {
        ip: any
        id: string,
        login: string,
        email: string,
        createdAt: string,
       
      }
      export type UsersModel =
      {
        id: string,
        login: string,
        email: string,
        createdAt: string,
        passwordSalt: string,
        passwordHash: string,
        emailConfirmation : EmailConfirmationType,
        refreshTokenBlackList: string[] 

      }
      export type EmailConfirmationType = { // usera 
        isConfirmed: boolean,
        confirmationCode: string,
        expirationDate: Date
    }


      export type UsersInputModel =
      {
        
        login: string,
        password: string
        email: string,
        
      }

      
export type CreateUserModel = {
  id: string
  login: string
  createdAt: string
  email: string
}