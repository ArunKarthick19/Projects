#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

struct sample {
    int bookid;
    char bookname[1000];
    char author[1000];
    float bookprice;
    int bookqty;
};

char bookname[1000], *p, author[1000], *k;
int max, choice;
int listBooks(struct sample *as, int *max);
int addBook(struct sample *as, int *max);
int removeBook(struct sample *as, int *max);
int findBook(struct sample *as, int *max);
int updateBook(struct sample *as, int *max);


int main() {
    struct sample as[6];  // Assuming a maximum of 5 books
    // int choice;

    printf("NTU BOOKSHOP MANAGEMENT PROGRAM:\n");
    printf("1: listBooks() \n");
    printf("2: addBook() \n");
    printf("3: removeBook() \n");
    printf("4: findBook() \n");
    printf("5: updateBook() \n");
    printf("6: quit \n");


    while (choice != 6) {
        printf("Enter your choice: \n");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                listBooks(as, &max);
                break;
            case 2:

                    addBook(as, &max);

                break;
            case 3:
                removeBook(as, &max);
                break;
            case 4:
                findBook(as, &max);
                break;
            case 5:
                updateBook(as, &max);
                break;
            default:
                return 0;
        }
    }

    return 0;
}

int listBooks(struct sample *as, int *max) {
    printf("listBooks(): \n");
    if(*max==0)
        {
        printf("The bookshop is empty\n");
        }
     if (*max != 0)
        {
        for (int i = 0; i < *max - 1; i++) {
            for (int j = 0; j < *max - i - 1; j++) {
                if (as[j].bookid > as[j + 1].bookid) {
                    struct sample temp = as[j];
                    as[j] = as[j + 1];
                    as[j + 1] = temp;
                }
            }
        }
        for (int i = 0; i < *max; i++)
            {
            printf("BookID: %d\n", as[i].bookid);
            printf("Book title: %s\n", as[i].bookname);
            printf("Author name: %s\n", as[i].author);
            printf("Book price: %.2f\n", as[i].bookprice);
            printf("Quantity: %d\n", as[i].bookqty);

            }
       }


    return 0;
}

int addBook(struct sample *as, int *max) {
    printf("addBook(): \n");
    printf("Enter bookID: \n");
    scanf("%d", &as[*max].bookid);
    getchar();  // Consume the newline character left in the buffer

    printf("Enter book title: \n");
    fgets(as[*max].bookname, sizeof(as[*max].bookname), stdin);
    if (p = strchr(as[*max].bookname, '\n')) *p = '\0';  // Remove the newline character

    printf("Enter author name: \n");
    fgets(as[*max].author, sizeof(as[*max].author), stdin);
    if (k = strchr(as[*max].author, '\n')) *k = '\0';  // Remove the newline character

    printf("Enter price: \n");
    scanf("%f", &as[*max].bookprice);

    printf("Enter quantity: \n");
    scanf("%d", &as[*max].bookqty);
    if(*max==5)
    {
        printf("The bookshop is full! Unable to addBook()\n");
        as[*max].bookid = '\0';
        as[*max].bookprice = '\0';
        as[*max].bookqty = '\0';
        as[*max].bookname[0] = '\0';
        as[*max].author[0] = '\0';
        return 0;
    }
    else
    {
       for(int r=0; r < *max; r++)
    {
        if(as[*max].bookid==as[r].bookid)
        {
            printf("The bookID has already existed! Unable to addBook()\n");
            return 0;
        }
    }
    }


    *max=*max+1;  // Increment max after the input
    printf("The book has been added successfully\n");
    return 0;
}

int removeBook(struct sample *as, int *max) {
     printf("removeBook(): \n");
    char findbk[1000], findauthor[1000];
    char namecopy[*max][1000];
    char authorcopy[*max][1000];
    char *p, *k;



    for (int c = 0; c < *max; c++) {
        strcpy(namecopy[c], as[c].bookname);
        strcpy(authorcopy[c], as[c].author);

        for (int i = 0; i < 1000; i++) {
            namecopy[c][i] = toupper(namecopy[c][i]);
            authorcopy[c][i] = toupper(authorcopy[c][i]);
        }
    }

    printf("Enter the target book title:\n");
    scanf(" %[^\n]", findbk);
    printf("Enter the target author name:\n");
    scanf(" %[^\n]", findauthor);
     if(*max==0)
    {
        printf("The bookshop is empty\n");
        return 0;
    }

    for (int k = 0; k < 1000; k++) {
        findbk[k] = toupper(findbk[k]);
        findauthor[k] = toupper(findauthor[k]);
    }

    for (int c = 0; c < *max; c++) {
        if (strcmp(findbk, namecopy[c]) == 0 && strcmp(findauthor, authorcopy[c]) == 0) {
            printf("The target book is removed\n", c);

            printf("BookID: %d\n", as[c].bookid);
            printf("Book title: %s\n", as[c].bookname);
            printf("Author name: %s\n", as[c].author);
            printf("Book price: %.2f\n", as[c].bookprice);
            printf("Quantity: %d\n", as[c].bookqty);
            as[c].bookid = 0;
            as[c].bookprice = 0;
            as[c].bookqty = 0;
            as[c].bookname[0] = '\0';
            as[c].author[0] = '\0';
            for (int i = c; i < *max - 1; i++) {
                as[i] = as[i + 1];
            }



            *max = *max - 1;
                if(*max==0)
        {
        printf("The bookshop is empty\n");
        }
            return 0;
        }
    }
    printf("The target book is not in the bookshop\n");
    return 0;
}

int findBook(struct sample *as, int *max) {
    printf("findBook(): \n");
    char findbk[1000], findauthor[1000];
    char namecopy[*max][1000];
    char authorcopy[*max][1000];

    for (int c = 0; c < *max; c++) {
        strcpy(namecopy[c], as[c].bookname);
        strcpy(authorcopy[c], as[c].author);

        for (int i = 0; i < 1000; i++) {
            namecopy[c][i] = toupper(namecopy[c][i]);
            authorcopy[c][i] = toupper(authorcopy[c][i]);
        }
    }

    printf("Enter the target book title:\n");
    scanf(" %[^\n]", findbk);
    printf("Enter the target author name:\n");
    scanf(" %[^\n]", findauthor);

    for (int k = 0; k < 1000; k++) {
        findbk[k] = toupper(findbk[k]);
        findauthor[k] = toupper(findauthor[k]);
    }

    for (int c = 0; c < *max; c++) {
        if (strcmp(findbk, namecopy[c]) == 0 && strcmp(findauthor, authorcopy[c]) == 0) {
            printf("The target book is found\n");
            printf("BookID: %d\n", as[c].bookid);
            printf("Book title: %s\n", as[c].bookname);
            printf("Author name: %s\n", as[c].author);
            printf("Book price: %.2f\n", as[c].bookprice);
            printf("Quantity: %d\n", as[c].bookqty);


            return 0;
        }
    }

    printf("The target book is not found\n");

    return 0;
}


int updateBook(struct sample *as, int *max) {
    printf("updateBook(): \n");
    char findbk[1000], findauthor[1000];
    char namecopy[*max][1000];
    char authorcopy[*max][1000];
    char *p, *k;

    for (int c = 0; c < *max; c++) {
        strcpy(namecopy[c], as[c].bookname);
        strcpy(authorcopy[c], as[c].author);

        for (int i = 0; i < 1000; i++) {
            namecopy[c][i] = toupper(namecopy[c][i]);
            authorcopy[c][i] = toupper(authorcopy[c][i]);
        }
    }

    printf("Enter the target book title:\n");
    scanf(" %[^\n]", findbk);
    printf("Enter the target author name:\n");
    scanf(" %[^\n]", findauthor);

    for (int k = 0; k < 1000; k++) {
        findbk[k] = toupper(findbk[k]);
        findauthor[k] = toupper(findauthor[k]);
    }
    for (int c = 0; c < *max; c++) {
        if (strcmp(findbk, namecopy[c]) == 0 && strcmp(findauthor, authorcopy[c]) == 0) {

            printf("Enter updated book price: \n");
            scanf("%f", &as[c].bookprice);

            printf("Enter updated quantity: \n");
            scanf("%d", &as[c].bookqty);

            printf("The target book is updated\n");

            printf("BookID: %d\n", as[c].bookid);
            printf("Book title: %s\n", as[c].bookname);
            printf("Author name: %s\n", as[c].author);
            printf("Book price: %.2f\n", as[c].bookprice);
            printf("Quantity: %d\n", as[c].bookqty);
            return 0;
        }
    }
    printf("The target book is not in the bookshop\n");
    return 0;
}



