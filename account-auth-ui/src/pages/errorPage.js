import React from "react";

const ErrorPage = () => {
    return (
        <div className="error-page-container">
            <h1 className="text-center c-black">Too Many Unsuccessful Attempts</h1>
            <section className="error-container">
                <span>4</span>
                <span>0</span>
                <span>4</span>
            </section>
            <h4 className="c-black">
                Sorry, we can't log you in.
            </h4>
        </div>
    );
};

export default ErrorPage;
